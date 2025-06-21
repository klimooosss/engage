import requests
import pandas as pd
import time
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from bs4 import BeautifulSoup
import concurrent.futures
import logging
from fake_useragent import UserAgent
from urllib.parse import quote

class BusinessScraper:
    def __init__(self):
        self.businesses = []
        self.setup_logging()
        self.ua = UserAgent()
        
        # Base URLs for APIs
        self.nominatim_url = "https://nominatim.openstreetmap.org"
        self.overpass_url = "https://overpass-api.de/api/interpreter"
        self.foursquare_url = "https://api.foursquare.com/v3"
        
        # Additional data sources
        self.data_sources = {
            'osm': True,  # OpenStreetMap
            'foursquare': False,  # Foursquare (requires API key)
            'yelp': False  # Yelp (requires API key)
        }
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
        
    def enable_data_source(self, source: str, api_key: str = None):
        """Enable additional data source with API key if required"""
        if source in self.data_sources:
            if source in ['foursquare', 'yelp'] and not api_key:
                self.logger.warning(f"{source} requires an API key")
                return False
            self.data_sources[source] = True
            if api_key:
                setattr(self, f"{source}_api_key", api_key)
            return True
        return False
        
    def _get_coordinates(self, location: str) -> Optional[Tuple[float, float]]:
        """Get coordinates for a location using Nominatim"""
        try:
            headers = {
                'User-Agent': self.ua.random
            }
            
            params = {
                'q': location,
                'format': 'json',
                'limit': 1
            }
            
            response = requests.get(
                f"{self.nominatim_url}/search",
                params=params,
                headers=headers
            )
            response.raise_for_status()
            
            data = response.json()
            if data:
                return float(data[0]['lat']), float(data[0]['lon'])
            return None
        except Exception as e:
            self.logger.error(f"Error getting coordinates: {str(e)}")
            return None
            
    def _search_businesses_osm(self, lat: float, lon: float, business_type: str) -> List[Dict]:
        """Search for businesses using OpenStreetMap's Overpass API"""
        try:
            # Convert business type to OSM tags
            osm_tags = self._get_osm_tags(business_type)
            tag_queries = []
            
            for tag_key, tag_value in osm_tags:
                tag_queries.append(f'node["{tag_key}"="{tag_value}"](around:5000,{lat},{lon});')
                tag_queries.append(f'way["{tag_key}"="{tag_value}"](around:5000,{lat},{lon});')
            
            # Build Overpass query
            query = f"""
                [out:json][timeout:25];
                (
                    {''.join(tag_queries)}
                );
                out body;
                >;
                out skel qt;
            """
            
            headers = {
                'User-Agent': self.ua.random,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            
            response = requests.post(
                self.overpass_url,
                data=query,
                headers=headers
            )
            response.raise_for_status()
            
            data = response.json()
            businesses = []
            
            for element in data.get('elements', []):
                if element.get('type') in ['node', 'way']:
                    tags = element.get('tags', {})
                    if tags:
                        # Only add businesses with a name
                        if 'name' in tags:
                            business = {
                                'name': tags.get('name', 'Unknown'),
                                'address': self._format_address(tags),
                                'phone': tags.get('phone', tags.get('contact:phone', '')),
                                'website': tags.get('website', tags.get('contact:website', '')),
                                'email': tags.get('email', tags.get('contact:email', '')),
                                'opening_hours': tags.get('opening_hours', ''),
                                'amenity': tags.get('amenity', ''),
                                'shop': tags.get('shop', ''),
                                'cuisine': tags.get('cuisine', ''),
                                'outdoor_seating': tags.get('outdoor_seating', ''),
                                'takeaway': tags.get('takeaway', ''),
                                'delivery': tags.get('delivery', ''),
                                'wheelchair': tags.get('wheelchair', ''),
                                'payment_methods': self._get_payment_methods(tags)
                            }
                            businesses.append(business)
            
            return businesses
        except Exception as e:
            self.logger.error(f"Error searching businesses: {str(e)}")
            return []
            
    def _get_osm_tags(self, business_type: str) -> List[Tuple[str, str]]:
        """Convert business type to OSM tags"""
        business_type = business_type.lower()
        tags = []
        
        # Common amenities
        amenities = {
            'restaurant': 'restaurant',
            'cafe': 'cafe',
            'bar': 'bar',
            'pub': 'pub',
            'fast_food': 'fast_food',
            'bank': 'bank',
            'pharmacy': 'pharmacy',
            'hospital': 'hospital',
            'school': 'school',
            'library': 'library'
        }
        
        # Common shops
        shops = {
            'supermarket': 'supermarket',
            'convenience': 'convenience',
            'bakery': 'bakery',
            'butcher': 'butcher',
            'clothes': 'clothes',
            'hardware': 'hardware',
            'electronics': 'electronics',
            'books': 'books'
        }
        
        if business_type in amenities:
            tags.append(('amenity', amenities[business_type]))
        if business_type in shops:
            tags.append(('shop', shops[business_type]))
            
        # If no exact match, try some common combinations
        if not tags:
            tags = [
                ('amenity', business_type),
                ('shop', business_type),
                ('craft', business_type)
            ]
            
        return tags
            
    def _format_address(self, tags: Dict) -> str:
        """Format address from OSM tags"""
        address_parts = []
        
        # Street address
        if 'addr:housenumber' in tags and 'addr:street' in tags:
            address_parts.append(f"{tags['addr:housenumber']} {tags['addr:street']}")
        elif 'addr:full' in tags:
            address_parts.append(tags['addr:full'])
            
        # City, State, etc.
        if 'addr:city' in tags:
            address_parts.append(tags['addr:city'])
        elif 'addr:suburb' in tags:  # Some places use suburb instead of city
            address_parts.append(tags['addr:suburb'])
            
        if 'addr:state' in tags:
            address_parts.append(tags['addr:state'])
        elif 'addr:province' in tags:  # Some places use province instead of state
            address_parts.append(tags['addr:province'])
            
        if 'addr:postcode' in tags:
            address_parts.append(tags['addr:postcode'])
            
        if 'addr:country' in tags:
            address_parts.append(tags['addr:country'])
        
        # If we don't have a proper address, try to use the name and city
        if not address_parts and 'name' in tags:
            address_parts.append(tags['name'])
            if 'addr:city' in tags:
                address_parts.append(tags['addr:city'])
            elif 'addr:suburb' in tags:
                address_parts.append(tags['addr:suburb'])
            
        return ', '.join(address_parts) if address_parts else 'Address not available'
        
    def _get_payment_methods(self, tags: Dict) -> List[str]:
        """Extract payment methods from OSM tags"""
        payment_methods = []
        
        payment_tags = {
            'payment:cash': 'Cash',
            'payment:credit_cards': 'Credit Cards',
            'payment:debit_cards': 'Debit Cards',
            'payment:mastercard': 'Mastercard',
            'payment:visa': 'Visa',
            'payment:american_express': 'American Express',
            'payment:contactless': 'Contactless'
        }
        
        for tag, label in payment_tags.items():
            if tags.get(tag) == 'yes':
                payment_methods.append(label)
                
        return payment_methods
        
    def search_businesses(self, location: str, business_type: str = '') -> None:
        """
        Search for businesses using multiple data sources
        location: e.g., "San Francisco, CA"
        business_type: e.g., "restaurant", "cafe", "supermarket", etc.
        """
        try:
            # Clear previous results
            self.businesses = []
            
            self.logger.info(f"Searching for {business_type} businesses in {location}...")
            
            # Get coordinates for the location
            coords = self._get_coordinates(location)
            if not coords:
                self.logger.error("Could not find coordinates for the specified location")
                return
                
            lat, lon = coords
            
            # Search using enabled data sources
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = []
                
                if self.data_sources['osm']:
                    futures.append(
                        executor.submit(self._search_businesses_osm, lat, lon, business_type)
                    )
                
                # Add other data sources here when enabled
                
                # Collect results
                all_businesses = []
                for future in concurrent.futures.as_completed(futures):
                    try:
                        businesses = future.result()
                        all_businesses.extend(businesses)
                    except Exception as e:
                        self.logger.error(f"Error collecting results: {str(e)}")
            
            if all_businesses:
                # Remove duplicates based on name and address
                seen = set()
                unique_businesses = []
                for business in all_businesses:
                    key = (business['name'], business['address'])
                    if key not in seen:
                        seen.add(key)
                        unique_businesses.append(business)
                
                self.businesses.extend(unique_businesses)
                self.logger.info(f"\nFound {len(unique_businesses)} unique businesses!")
                for business in unique_businesses:
                    self.logger.info(f"\nBusiness: {business['name']}")
                    self.logger.info(json.dumps(business, indent=2))
            else:
                self.logger.warning(f"\nNo businesses found for type '{business_type}' in {location}")
                
        except Exception as e:
            self.logger.error(f"Error during search: {str(e)}")
    
    def save_results(self, filename: str = None):
        """Save scraped business data to CSV file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'business_data_{timestamp}.csv'
            
        if self.businesses:
            # Convert list fields to strings
            processed_businesses = []
            for business in self.businesses:
                processed = business.copy()
                if 'payment_methods' in processed:
                    processed['payment_methods'] = ', '.join(processed['payment_methods'])
                processed_businesses.append(processed)
            
            df = pd.DataFrame(processed_businesses)
            
            # Reorder columns for better readability
            column_order = [
                'name', 'address', 'phone', 'email', 'website',
                'opening_hours', 'cuisine', 'outdoor_seating',
                'takeaway', 'delivery', 'wheelchair',
                'payment_methods', 'source', 'location'
            ]
            
            # Only include columns that exist in the DataFrame
            columns = [col for col in column_order if col in df.columns]
            # Add any remaining columns at the end
            columns.extend([col for col in df.columns if col not in columns])
            
            df = df[columns]
            df.to_csv(filename, index=False)
            
            self.logger.info(f"\nData saved to {filename}")
            self.logger.info("\nSummary of found data:")
            self.logger.info(f"Total businesses scraped: {len(self.businesses)}")
            self.logger.info("\nData includes:")
            for column in df.columns:
                non_empty = df[column].notna().sum()
                self.logger.info(f"- {column}: {non_empty} entries")
        else:
            self.logger.warning("\nNo business data was collected.")

def main():
    # Initialize scraper
    scraper = BusinessScraper()
    
    print("\nWelcome to the Enhanced Business Information Scraper!")
    print("This scraper uses multiple data sources to find detailed business information.")
    print("\nAvailable business types include:")
    print("\nAmenities:")
    print("- restaurant")
    print("- cafe")
    print("- bar")
    print("- pub")
    print("- fast_food")
    print("- bank")
    print("- pharmacy")
    print("- hospital")
    print("\nShops:")
    print("- supermarket")
    print("- convenience")
    print("- bakery")
    print("- butcher")
    print("- clothes")
    print("- hardware")
    print("- electronics")
    print("- books")
    
    # Example usage
    print("\nExample usage:")
    print('scraper.search_businesses("San Francisco, CA", "restaurant")')
    
    # Example locations
    locations = [
        "San Francisco, CA",
        "New York, NY",
        "Chicago, IL"
    ]
    
    business_types = [
        "restaurant",
        "cafe",
        "supermarket",
        "bakery",
        "bar"
    ]
    
    # Note: Uncomment the following lines to run example searches
    # for location in locations:
    #     for business_type in business_types:
    #         scraper.search_businesses(location, business_type)
    #         time.sleep(2)  # Be respectful to the API
    # 
    # scraper.save_results()

if __name__ == "__main__":
    main() 