document.addEventListener('DOMContentLoaded', function() {
    const scrapeForm = document.getElementById('scrapeForm');
    const progress = document.getElementById('progress');
    const results = document.getElementById('results');
    const statusText = document.getElementById('statusText');
    const listView = document.getElementById('listView');
    const mapView = document.getElementById('mapView');
    const listViewBtn = document.getElementById('listViewBtn');
    const mapViewBtn = document.getElementById('mapViewBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercent = document.getElementById('progressPercent');
    const downloadLink = document.getElementById('downloadLink');
    const businessType = document.getElementById('businessType');
    const activeFilters = document.getElementById('activeFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    let currentJobId = null;
    let currentBusinesses = [];
    let activeFilterTypes = new Set();
    let map = null;
    let markers = [];

    // Initialize form validation and handle submission
    scrapeForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (!this.checkValidity()) {
            event.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        this.classList.add('was-validated');
        
        // Get form data
        const formData = {
            location: document.getElementById('location').value.trim(),
            business_type: document.getElementById('businessType').value.trim(),
            max_results: parseInt(document.getElementById('maxResults').value) || 10
        };
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        loadingOverlay.classList.add('show');
        
        try {
            const response = await fetch('/start_scraping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentJobId = data.job_id;
                progress.classList.remove('d-none');
                results.classList.add('d-none');
                statusText.textContent = 'Starting search...';
                progressBar.style.width = '0%';
                progressPercent.textContent = '0%';
                
                // Clear previous results
                currentBusinesses = [];
                markers.forEach(marker => map.removeLayer(marker));
                markers = [];
                listView.innerHTML = '';
                
                // Start polling for results
                pollJobStatus();
            } else {
                throw new Error(data.error || 'Failed to start scraping');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-search"></i> Start Scraping';
            loadingOverlay.classList.remove('show');
        }
    });

    // Handle current location button
    useCurrentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            useCurrentLocationBtn.disabled = true;
            useCurrentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    document.getElementById('location').value = 
                        `${position.coords.latitude}, ${position.coords.longitude}`;
                    useCurrentLocationBtn.disabled = false;
                    useCurrentLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                },
                function(error) {
                    alert('Error getting location: ' + error.message);
                    useCurrentLocationBtn.disabled = false;
                    useCurrentLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });

    // Handle view toggle
    listViewBtn.addEventListener('click', function() {
        listView.classList.remove('d-none');
        mapView.classList.add('d-none');
        listViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');
    });

    mapViewBtn.addEventListener('click', function() {
        listView.classList.add('d-none');
        mapView.classList.remove('d-none');
        listViewBtn.classList.remove('active');
        mapViewBtn.classList.add('active');

        // Initialize map if needed and update markers
        setTimeout(() => {
            initMap();
        }, 100);
    });

    // Initialize map
    function initMap() {
        if (!map) {
            map = L.map('mapView', {
                minZoom: 2,
                maxZoom: 18,
                zoomControl: true,
                scrollWheelZoom: true
            }).setView([0, 0], 2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        }

        // Force a map refresh
        setTimeout(() => {
            map.invalidateSize();
            updateMapMarkers();
        }, 100);
    }

    // Create map popup content
    function createMapPopup(business) {
        let facilities = [];
        if (business.outdoor_seating === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-umbrella-beach"></i>Outdoor</span>');
        if (business.takeaway === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-shopping-bag"></i>Takeaway</span>');
        if (business.delivery === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-truck"></i>Delivery</span>');
        if (business.wheelchair === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-wheelchair"></i>Accessible</span>');

        return `
            <div class="map-popup">
                <h5>${business.name}</h5>
                <p class="business-address"><i class="fas fa-map-marker-alt text-danger"></i> ${business.address || 'No address available'}</p>
                ${business.phone ? `
                    <p><i class="fas fa-phone text-success"></i> <a href="tel:${business.phone}">${business.phone}</a></p>
                ` : ''}
                ${business.website ? `
                    <p><i class="fas fa-globe text-info"></i> <a href="${business.website}" target="_blank">${business.website}</a></p>
                ` : ''}
                ${facilities.length > 0 ? `
                    <div class="mt-2">
                        ${facilities.join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Handle filter card clicks
    document.querySelectorAll('.filter-card').forEach(card => {
        card.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            
            // Add loading state
            document.querySelectorAll('.filter-card').forEach(c => c.classList.add('loading'));
            
            setTimeout(() => {
                toggleFilter(filterType);
                updateBusinessList();
                if (!mapView.classList.contains('d-none')) {
                    updateMapMarkers();
                }
                
                // Remove loading state
                document.querySelectorAll('.filter-card').forEach(c => c.classList.remove('loading'));
            }, 300);
        });
    });

    // Handle clear filters button
    clearFiltersBtn.addEventListener('click', function() {
        // Add loading state
        document.querySelectorAll('.filter-card').forEach(card => card.classList.add('loading'));
        
        setTimeout(() => {
            activeFilterTypes.clear();
            updateActiveFilters();
            updateBusinessList();
            if (!mapView.classList.contains('d-none')) {
                updateMapMarkers();
            }
            
            // Remove loading state
            document.querySelectorAll('.filter-card').forEach(card => card.classList.remove('loading'));
        }, 300);
    });

    // Handle export buttons
    document.getElementById('downloadCSV').addEventListener('click', function(e) {
        e.preventDefault();
        exportData('csv');
    });

    document.getElementById('downloadJSON').addEventListener('click', function(e) {
        e.preventDefault();
        exportData('json');
    });

    document.getElementById('downloadExcel').addEventListener('click', function(e) {
        e.preventDefault();
        exportData('excel');
    });

    function exportData(format) {
        const filteredBusinesses = getFilteredBusinesses();
        let data;
        let filename;
        let contentType;

        switch (format) {
            case 'json':
                data = JSON.stringify(filteredBusinesses, null, 2);
                filename = 'businesses.json';
                contentType = 'application/json';
                break;
            case 'csv':
                data = convertToCSV(filteredBusinesses);
                filename = 'businesses.csv';
                contentType = 'text/csv';
                break;
            case 'excel':
                // For Excel, we'll use CSV format with UTF-8 BOM
                data = '\ufeff' + convertToCSV(filteredBusinesses);
                filename = 'businesses.xlsx';
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
        }

        const blob = new Blob([data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    function convertToCSV(businesses) {
        const headers = [
            'Name', 'Address', 'Phone', 'Email', 'Website', 'Opening Hours',
            'Cuisine', 'Outdoor Seating', 'Takeaway', 'Delivery',
            'Wheelchair Accessible', 'Payment Methods', 'Source', 'Location'
        ];

        const rows = businesses.map(business => [
            business.name,
            business.address,
            business.phone,
            business.email,
            business.website,
            business.opening_hours,
            business.cuisine,
            business.outdoor_seating,
            business.takeaway,
            business.delivery,
            business.wheelchair,
            Array.isArray(business.payment_methods) ? business.payment_methods.join('; ') : business.payment_methods,
            business.source,
            business.location
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => {
                // Handle cells that contain commas or quotes
                if (cell === null || cell === undefined) {
                    return '';
                }
                cell = cell.toString();
                if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(','))
        ].join('\n');
    }

    function toggleFilter(filterType) {
        if (activeFilterTypes.has(filterType)) {
            activeFilterTypes.delete(filterType);
        } else {
            activeFilterTypes.add(filterType);
        }
        updateActiveFilters();
    }

    function updateActiveFilters() {
        // Update filter cards visual state
        document.querySelectorAll('.filter-card').forEach(card => {
            const filterType = card.dataset.filter;
            if (activeFilterTypes.has(filterType)) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Update active filters display
        activeFilters.innerHTML = '';
        if (activeFilterTypes.size > 0) {
            clearFiltersBtn.classList.remove('d-none');
            activeFilterTypes.forEach(filter => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-primary me-2';
                badge.innerHTML = `
                    ${getFilterLabel(filter)}
                    <i class="fas fa-times ms-1" role="button" onclick="removeFilter('${filter}')"></i>
                `;
                activeFilters.appendChild(badge);
            });
        } else {
            clearFiltersBtn.classList.add('d-none');
        }
    }

    function getFilterLabel(filter) {
        const labels = {
            'website': 'Has Website',
            'phone': 'Has Phone',
            'email': 'Has Email',
            'hours': 'Has Hours'
        };
        return labels[filter] || filter;
    }

    // Add this to window object so onclick handler can access it
    window.removeFilter = function(filter) {
        // Add loading state
        document.querySelectorAll('.filter-card').forEach(card => card.classList.add('loading'));
        
        setTimeout(() => {
            activeFilterTypes.delete(filter);
            updateActiveFilters();
            updateBusinessList();
            if (!mapView.classList.contains('d-none')) {
                updateMapMarkers();
            }
            
            // Remove loading state
            document.querySelectorAll('.filter-card').forEach(card => card.classList.remove('loading'));
        }, 300);
    };

    function getFilteredBusinesses() {
        if (!currentBusinesses.length) return [];

        if (activeFilterTypes.size === 0) {
            return currentBusinesses;
        }

        return currentBusinesses.filter(business => {
            return Array.from(activeFilterTypes).every(filter => {
                switch (filter) {
                    case 'website':
                        return business.website;
                    case 'phone':
                        return business.phone;
                    case 'email':
                        return business.email;
                    case 'hours':
                        return business.opening_hours;
                    default:
                        return true;
                }
            });
        });
    }

    function updateBusinessList() {
        const filteredBusinesses = getFilteredBusinesses();
        
        listView.innerHTML = '';
        
        filteredBusinesses.forEach(business => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            
            let facilities = [];
            if (business.outdoor_seating === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-umbrella-beach"></i>Outdoor Seating</span>');
            if (business.takeaway === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-shopping-bag"></i>Takeaway</span>');
            if (business.delivery === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-truck"></i>Delivery</span>');
            if (business.wheelchair === 'yes') facilities.push('<span class="facility-badge"><i class="fas fa-wheelchair"></i>Wheelchair Accessible</span>');
            
            let paymentMethods = '';
            if (business.payment_methods && business.payment_methods.length > 0) {
                paymentMethods = business.payment_methods.map(method => 
                    `<span class="facility-badge"><i class="fas fa-credit-card"></i>${method}</span>`
                ).join('');
            }
            
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="mb-0" style="color: black;">${business.name}</h5>
                    <span class="badge bg-secondary">${business.source}</span>
                </div>
                <p class="mb-2 business-address" style="color: black;">
                    <i class="fas fa-map-marker-alt text-danger"></i> ${business.address || 'No address available'}
                </p>
                ${business.phone ? `
                    <p class="mb-2" style="color: black;">
                        <i class="fas fa-phone text-success"></i> 
                        <a href="tel:${business.phone}" style="color: black;">${business.phone}</a>
                    </p>
                ` : ''}
                ${business.email ? `
                    <p class="mb-2" style="color: black;">
                        <i class="fas fa-envelope text-primary"></i> 
                        <a href="mailto:${business.email}" style="color: black;">${business.email}</a>
                    </p>
                ` : ''}
                ${business.website ? `
                    <p class="mb-2" style="color: black;">
                        <i class="fas fa-globe text-info"></i> 
                        <a href="${business.website}" target="_blank" rel="noopener noreferrer" style="color: black;">${business.website}</a>
                    </p>
                ` : ''}
                ${business.opening_hours ? `
                    <p class="mb-2 business-hours" style="color: black;">
                        <i class="fas fa-clock text-warning"></i> ${business.opening_hours}
                    </p>
                ` : ''}
                ${business.cuisine ? `
                    <p class="mb-2" style="color: black;">
                        <i class="fas fa-utensils text-danger"></i> ${capitalizeWords(business.cuisine.replace(';', ', '))}
                    </p>
                ` : ''}
                ${facilities.length > 0 ? `
                    <div class="mb-2">
                        ${facilities.join('')}
                    </div>
                ` : ''}
                ${paymentMethods ? `
                    <div class="mb-2">
                        ${paymentMethods}
                    </div>
                ` : ''}
            `;
            
            listView.appendChild(item);
        });

        // Update results count with animation
        const totalElement = document.getElementById('totalBusinesses');
        const currentCount = parseInt(totalElement.textContent);
        const newCount = filteredBusinesses.length;
        
        if (currentCount !== newCount) {
            totalElement.style.opacity = '0';
            setTimeout(() => {
                totalElement.textContent = newCount;
                totalElement.style.opacity = '1';
            }, 200);
        }
    }

    // Load business types from API
    async function loadBusinessTypes() {
        try {
            const response = await fetch('/api/business_types');
            const data = await response.json();
            
            const amenitiesGroup = document.getElementById('amenitiesGroup');
            const shopsGroup = document.getElementById('shopsGroup');
            
            // Add amenities
            data.amenities.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = capitalizeWords(type);
                amenitiesGroup.appendChild(option);
            });
            
            // Add shops
            data.shops.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = capitalizeWords(type);
                shopsGroup.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading business types:', error);
        }
    }

    // Poll job status
    async function pollJobStatus() {
        if (!currentJobId) return;
        
        try {
            const response = await fetch(`/job_status/${currentJobId}`);
            const data = await response.json();
            
            if (response.ok) {
                updateProgress(data);
                
                if (data.status === 'completed') {
                    if (data.error) {
                        showError(data.error);
                    } else {
                        showResults(data);
                    }
                } else if (data.status === 'error') {
                    showError(data.message || 'An error occurred during scraping');
                } else {
                    setTimeout(pollJobStatus, 1000);
                }
            } else {
                throw new Error(data.error || 'Failed to get job status');
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Update progress bar and status
    function updateProgress(data) {
        progressBar.style.width = `${data.progress}%`;
        progressPercent.textContent = `${data.progress}%`;
        statusText.textContent = data.message || 'Processing...';
    }

    // Show results
    function showResults(data) {
        progress.classList.add('d-none');
        results.classList.remove('d-none');
        
        // Store current businesses
        currentBusinesses = data.businesses || [];
        
        // Update statistics with animation
        const stats = {
            'totalBusinesses': data.summary.total_businesses,
            'withWebsite': data.summary.with_website,
            'withPhone': data.summary.with_phone,
            'withEmail': data.summary.with_email,
            'withHours': data.summary.with_hours
        };
        
        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = value;
                element.style.opacity = '1';
            }, 200);
        });
        
        // Update business list
        updateBusinessList();
        
        // Initialize map if in map view
        if (!mapView.classList.contains('d-none')) {
            if (!map) {
                initMap();
            }
            updateMapMarkers();
        }
        
        if (data.filename) {
            downloadLink.href = `/download/${data.filename}`;
        }
    }

    // Show error message
    function showError(message) {
        progress.classList.add('d-none');
        statusText.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }

    // Helper function to capitalize words
    function capitalizeWords(str) {
        return str.split(/[_\s;]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Geocode an address using Nominatim
    async function geocodeAddress(address) {
        try {
            const encodedAddress = encodeURIComponent(address);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
            return null;
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    }

    // Update map markers
    async function updateMapMarkers() {
        if (!map) {
            initMap();
            return;
        }

        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'alert alert-info';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading markers...';
        mapView.insertAdjacentElement('afterbegin', loadingDiv);

        try {
            // Process businesses in batches to avoid rate limiting
            const batchSize = 1; // Process one at a time to respect Nominatim's rate limit
            const delay = 1000; // 1 second delay between requests

            for (let i = 0; i < currentBusinesses.length; i += batchSize) {
                const batch = currentBusinesses.slice(i, i + batchSize);
                
                for (const business of batch) {
                    if (business.address) {
                        const coords = await geocodeAddress(business.address);
                        if (coords) {
                            try {
                                const marker = L.marker([coords.lat, coords.lng])
                                    .bindPopup(createMapPopup(business))
                                    .addTo(map);
                                markers.push(marker);

                                // Update loading message
                                loadingDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading markers... (${i + 1}/${currentBusinesses.length})`;
                            } catch (error) {
                                console.error('Error adding marker for business:', business.name, error);
                            }
                        }
                        // Respect Nominatim's rate limit
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }

            // Fit map bounds if there are markers
            if (markers.length > 0) {
                try {
                    const group = new L.featureGroup(markers);
                    const bounds = group.getBounds();
                    map.fitBounds(bounds.pad(0.1));
                } catch (error) {
                    console.error('Error fitting bounds:', error);
                    map.setView([0, 0], 2);
                }
            } else {
                // If no markers, show world view
                map.setView([0, 0], 2);
            }
        } finally {
            // Remove loading div
            loadingDiv.remove();
        }

        // Force a map refresh
        map.invalidateSize();
    }

    // Load business types on page load
    loadBusinessTypes();
}); 