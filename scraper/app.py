from flask import Flask, render_template, request, jsonify, send_file, session
from business_scraper import BusinessScraper
import os
from datetime import datetime
import threading
import json
import logging
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global variables for managing scraping jobs
jobs = {}
results = {}
scraper = BusinessScraper()

def run_scraper(job_id, location, business_type, max_results):
    """Run the scraper in a background thread"""
    try:
        # Update job status
        jobs[job_id]['status'] = 'running'
        jobs[job_id]['progress'] = 0
        jobs[job_id]['message'] = 'Starting search...'
        
        # Clear previous results
        scraper.businesses = []
        
        # Run the scraper
        scraper.search_businesses(location, business_type)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = 'business_data_{}.csv'.format(timestamp)
        filepath = os.path.join('static', 'downloads', filename)
        
        # Save results
        scraper.save_results(filepath)
        
        # Store results
        results[job_id] = {
            'status': 'completed',
            'filename': filename,
            'total_businesses': len(scraper.businesses),
            'businesses': scraper.businesses
        }
        
        # Update job status
        jobs[job_id]['status'] = 'completed'
        jobs[job_id]['progress'] = 100
        jobs[job_id]['message'] = 'Found {} businesses'.format(len(scraper.businesses))
        
    except Exception as e:
        logger.error('Error in scraping job {}: {}'.format(job_id, str(e)))
        results[job_id] = {
            'status': 'error',
            'error': str(e)
        }
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['message'] = 'Error: {}'.format(str(e))

def cleanup_old_files():
    """Clean up old downloaded files"""
    try:
        downloads_dir = os.path.join('static', 'downloads')
        current_time = datetime.now()
        for filename in os.listdir(downloads_dir):
            filepath = os.path.join(downloads_dir, filename)
            file_modified = datetime.fromtimestamp(os.path.getmtime(filepath))
            if (current_time - file_modified).days > 1:  # Remove files older than 1 day
                os.remove(filepath)
                logger.info('Removed old file: {}'.format(filename))
    except Exception as e:
        logger.error('Error cleaning up files: {}'.format(str(e)))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_scraping', methods=['POST'])
def start_scraping():
    try:
        data = request.json
        location = data.get('location', '').strip()
        business_type = data.get('business_type', '').strip()
        max_results = int(data.get('max_results', 10))
        
        # Validate input
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        if max_results < 1 or max_results > 100:
            return jsonify({'error': 'Max results must be between 1 and 100'}), 400
        
        # Generate job ID
        job_id = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Create job
        jobs[job_id] = {
            'status': 'initializing',
            'location': location,
            'business_type': business_type,
            'max_results': max_results,
            'progress': 0,
            'message': 'Initializing...',
            'start_time': datetime.now().isoformat()
        }
        
        # Start scraping in background
        thread = threading.Thread(
            target=run_scraper,
            args=(job_id, location, business_type, max_results)
        )
        thread.start()
        
        # Clean up old files
        cleanup_thread = threading.Thread(target=cleanup_old_files)
        cleanup_thread.start()
        
        return jsonify({
            'job_id': job_id,
            'message': 'Scraping job started successfully'
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid input: ' + str(e)}), 400
    except Exception as e:
        logger.error('Error starting scraping job: {}'.format(str(e)))
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/job_status/<job_id>')
def job_status(job_id):
    try:
        if job_id not in jobs:
            return jsonify({'error': 'Job not found'}), 404
        
        status_data = {
            'status': jobs[job_id]['status'],
            'progress': jobs[job_id]['progress'],
            'message': jobs[job_id]['message']
        }
        
        if job_id in results:
            status_data.update(results[job_id])
            
            # Add summary statistics
            if results[job_id].get('businesses'):
                businesses = results[job_id]['businesses']
                status_data['summary'] = {
                    'total_businesses': len(businesses),
                    'with_website': sum(1 for b in businesses if b.get('website')),
                    'with_phone': sum(1 for b in businesses if b.get('phone')),
                    'with_email': sum(1 for b in businesses if b.get('email')),
                    'with_hours': sum(1 for b in businesses if b.get('opening_hours'))
                }
        
        return jsonify(status_data)
        
    except Exception as e:
        logger.error('Error getting job status: {}'.format(str(e)))
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/download/<filename>')
def download_file(filename):
    try:
        # Validate filename
        filename = secure_filename(filename)
        filepath = os.path.join('static', 'downloads', filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
            
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype='text/csv'
        )
        
    except Exception as e:
        logger.error('Error downloading file: {}'.format(str(e)))
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/business_types')
def get_business_types():
    """Get list of available business types"""
    business_types = {
        'amenities': [
            'restaurant',
            'cafe',
            'bar',
            'pub',
            'fast_food',
            'bank',
            'pharmacy',
            'hospital',
            'school',
            'library'
        ],
        'shops': [
            'supermarket',
            'convenience',
            'bakery',
            'butcher',
            'clothes',
            'hardware',
            'electronics',
            'books'
        ]
    }
    return jsonify(business_types)

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error('Internal server error: {}'.format(str(error)))
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create downloads directory if it doesn't exist
    os.makedirs(os.path.join('static', 'downloads'), exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000) 