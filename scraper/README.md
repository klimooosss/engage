# Business Information Scraper

A web application that scrapes business information from across the web. It uses Google search to find business websites and extracts contact information, including:

- Business names
- Email addresses
- Phone numbers
- Physical addresses
- Websites
- And more!

## Features

- Modern web interface
- Real-time progress updates
- CSV export
- Configurable search parameters
- Background processing
- Detailed results view

## Requirements

- Python 3.7+
- Chrome browser (for Selenium WebDriver)
- Required Python packages (see requirements.txt)

## Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Chrome WebDriver will be automatically installed by webdriver-manager

## Usage

1. Start the Flask application:
```bash
python app.py
```

2. Open your browser and go to:
```
http://localhost:5000
```

3. In the web interface:
   - Enter a location (e.g., "San Francisco, CA")
   - Optionally specify a business type (e.g., "restaurant", "cafe")
   - Set the maximum number of results to scrape
   - Click "Start Scraping"

4. The application will:
   - Search for businesses matching your criteria
   - Extract contact information from their websites
   - Display results in real-time
   - Allow you to download the data as CSV

## Important Notes

- Be respectful of websites' robots.txt files and terms of service
- Add appropriate delays between requests to avoid overwhelming servers
- Some websites may have anti-scraping measures in place
- Consider reaching out to businesses directly if you need their information for commercial purposes

## Project Structure

```
scraper/
├── app.py                 # Flask application
├── business_scraper.py    # Core scraping functionality
├── requirements.txt       # Python dependencies
├── static/               # Static files
│   ├── style.css        # Custom styles
│   └── script.js        # Frontend JavaScript
└── templates/           # HTML templates
    └── index.html       # Main page template
```

## Legal Disclaimer

This tool is for educational purposes only. Users are responsible for ensuring their use of this tool complies with applicable laws and website terms of service. 