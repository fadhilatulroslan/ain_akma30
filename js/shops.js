$(document).ready(function(){

    // ========================================
    // SHOPS PAGE - REAL LOCATION SEARCH
    // ========================================
    
    let userLat = null;
    let userLng = null;
    let currentLocationName = '';

    // ========================================
    // GET REAL USER LOCATION
    // ========================================
    
    $('#getLocationBtn').on('click', function() {
        // Minta izin location dari browser
        if (navigator.geolocation) {
            $('#locationStatus').html('<div class="status-loading"><span class="spinner-small"></span> 📍 Requesting location permission...</div>');
            $('#shopsList').html('<div class="loading-shops">📍 Getting your location...</div>');
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Berjaya dapat location
                    userLat = position.coords.latitude;
                    userLng = position.coords.longitude;
                    
                    $('#locationStatus').html(`<div class="status-success">✅ Location found! (${userLat.toFixed(4)}, ${userLng.toFixed(4)})</div>`);
                    
                    // Dapatkan nama kawasan
                    getLocationName(userLat, userLng);
                    
                    // Cari kedai
                    searchNearbyShops(userLat, userLng, $('#radiusSelect').val());
                },
                function(error) {
                    // Gagal dapat location
                    let errorMsg = '';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = '❌ Location permission denied. Please allow location access in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = '❌ Cannot get your location. Please enable GPS.';
                            break;
                        case error.TIMEOUT:
                            errorMsg = '❌ Location request timeout. Please try again.';
                            break;
                        default:
                            errorMsg = '❌ Unknown location error. Please try again.';
                    }
                    $('#locationStatus').html(`<div class="status-error">${errorMsg}</div>`);
                    $('#shopsList').html(`
                        <div class="no-shops-found">
                            <div class="no-shops-icon">📍❌</div>
                            <div class="no-shops-title">Location Access Needed</div>
                            <div class="no-shops-message">
                                ${errorMsg}<br><br>
                                💡 To find shops near you:<br>
                                • Click the location icon in your browser bar<br>
                                • Select "Allow" for location access<br>
                                • Then click "Get My Location" again
                            </div>
                            <button onclick="location.reload()" class="retry-btn">🔄 Try Again</button>
                        </div>
                    `);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            $('#locationStatus').html('<div class="status-error">❌ Your browser does not support geolocation.</div>');
        }
    });
    
    // ========================================
    // GET LOCATION NAME FROM COORDINATES
    // ========================================
    
    function getLocationName(lat, lng) {
        let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
        $.getJSON(url, function(data) {
            if (data.address) {
                let city = data.address.city || data.address.town || data.address.village || data.address.state || data.address.county;
                if (city) {
                    currentLocationName = city;
                    $('#locationStatus').html(`<div class="status-success">📍 Location: ${city}</div>`);
                } else {
                    currentLocationName = 'your area';
                }
            }
        }).fail(function() {
            currentLocationName = 'your area';
        });
    }
    
    // ========================================
    // SEARCH BY AREA NAME
    // ========================================
    
    $('#searchAreaBtn').on('click', function() {
        let area = $('#areaSearch').val().trim();
        if (!area) {
            alert('Please enter an area name');
            return;
        }
        
        $('#locationStatus').html(`<div class="status-loading"><span class="spinner-small"></span> 🔍 Searching "${area}"...</div>`);
        $('#shopsList').html('<div class="loading-shops">🔍 Finding location...</div>');
        
        let geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(area)}, Malaysia&limit=1`;
        
        $.getJSON(geocodeUrl, function(data) {
            if (data && data.length > 0) {
                userLat = parseFloat(data[0].lat);
                userLng = parseFloat(data[0].lon);
                currentLocationName = data[0].display_name.split(',')[0];
                
                $('#locationStatus').html(`<div class="status-success">✅ Showing shops in: ${currentLocationName}</div>`);
                searchNearbyShops(userLat, userLng, $('#radiusSelect').val());
            } else {
                $('#locationStatus').html(`<div class="status-error">⚠️ Cannot find "${area}"</div>`);
                $('#shopsList').html(`
                    <div class="no-shops-found">
                        <div class="no-shops-icon">🔍😢</div>
                        <div class="no-shops-title">Location not found</div>
                        <div class="no-shops-message">
                            We couldn't find "${area}". Try:<br>
                            • Kuala Lumpur<br>
                            • Ipoh<br>
                            • Johor Bahru<br>
                            • Penang<br>
                            • Shah Alam
                        </div>
                    </div>
                `);
            }
        }).fail(function() {
            $('#locationStatus').html(`<div class="status-error">⚠️ Network error. Please try again.</div>`);
        });
    });
    
    $('#areaSearch').on('keypress', function(e) {
        if (e.which === 13) $('#searchAreaBtn').click();
    });
    
    // ========================================
    // RADIUS CHANGE
    // ========================================
    
    $('#radiusSelect').on('change', function() {
        if (userLat && userLng) {
            searchNearbyShops(userLat, userLng, $(this).val());
        }
    });
    
    // ========================================
    // SEARCH NEARBY SHOPS
    // ========================================
    
    function searchNearbyShops(lat, lng, radius) {
        $('#shopsList').html('<div class="loading-shops">🔍 Searching for laptop shops nearby...</div>');
        $('#resultsCount').html('');
        
        const radiusKm = radius / 1000;
        
        // Overpass API query
        const query = `[out:json][timeout:15];
(
  node["shop"="computer"](around:${radius},${lat},${lng});
  node["shop"="laptop"](around:${radius},${lat},${lng});
  node["craft"="computer_repair"](around:${radius},${lat},${lng});
);
out body;`;
        
        const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
        
        $.ajax({
            url: OVERPASS_URL,
            method: 'GET',
            data: { data: query },
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                displayShopsFromAPI(data, lat, lng);
            },
            error: function(xhr, status, error) {
                console.error('Overpass API error:', error);
                displayMockShops();
            }
        });
    }
    
    // ========================================
    // DISPLAY SHOPS FROM API
    // ========================================
    
    function displayShopsFromAPI(data, userLat, userLng) {
        let shops = [];
        
        if (data.elements && data.elements.length > 0) {
            for (let element of data.elements) {
                let lat = element.lat;
                let lon = element.lon;
                
                if (lat && lon) {
                    let tags = element.tags || {};
                    let distance = calculateDistance(userLat, userLng, lat, lon);
                    let distanceText = distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
                    
                    let shopName = tags.name || tags.brand || 'Computer Shop';
                    let address = tags['addr:street'] || tags['addr:full'] || 'Address available on map';
                    let phone = tags.phone || 'Not listed';
                    let openingHours = tags.opening_hours || 'Call to confirm';
                    let shopIcon = tags.shop === 'computer' ? '💻' : '🔧';
                    
                    shops.push({
                        name: shopName,
                        lat: lat,
                        lng: lon,
                        address: address,
                        phone: phone,
                        opening_hours: openingHours,
                        shopIcon: shopIcon,
                        distance: distance,
                        distanceText: distanceText
                    });
                }
            }
        }
        
        // Remove duplicates
        let uniqueShops = [];
        let seen = new Set();
        for (let shop of shops) {
            let key = `${shop.name}-${shop.address}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueShops.push(shop);
            }
        }
        
        uniqueShops.sort((a, b) => a.distance - b.distance);
        
        if (uniqueShops.length > 0) {
            displayShopsList(uniqueShops);
        } else {
            showNoShopsFound(currentLocationName || 'your area', $('#radiusSelect').val() / 1000);
        }
    }
    
    // ========================================
    // CALCULATE DISTANCE
    // ========================================
    
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // ========================================
    // DISPLAY SHOPS LIST
    // ========================================
    
    function displayShopsList(shops) {
        $('#resultsCount').html(`📊 ${shops.length} laptop shop(s) found nearby`);
        
        let html = '';
        for (let shop of shops) {
            html += `
                <div class="shop-card">
                    <div class="shop-header">
                        <div class="shop-name">${shop.shopIcon} ${shop.name}</div>
                        <div class="shop-distance-badge">${shop.distanceText}</div>
                    </div>
                    <div class="shop-address">📍 ${shop.address}</div>
                    <div class="shop-contact">📞 ${shop.phone}</div>
                    <div class="shop-hours">🕐 ${shop.opening_hours}</div>
                    <div class="shop-footer">
                        <button class="direction-btn" data-lat="${shop.lat}" data-lng="${shop.lng}" data-name="${shop.name}">
                            🧭 Get Directions
                        </button>
                    </div>
                </div>
            `;
        }
        
        $('#shopsList').html(html);
        
        $('.direction-btn').on('click', function() {
            let lat = $(this).data('lat');
            let lng = $(this).data('lng');
            let name = $(this).data('name');
            
            if (confirm(`Open directions to ${name}?`)) {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
            }
        });
    }
    
    // ========================================
    // FALLBACK MOCK SHOPS
    // ========================================
    
    function displayMockShops() {
        let mockShops = [
            { name: "PC Express Laptop Repair", address: "Nearby computer shop", phone: "012-3456789", distanceText: "1.2 km", shopIcon: "💻" },
            { name: "Laptop Medic Centre", address: "Local repair specialist", phone: "013-4567890", distanceText: "2.5 km", shopIcon: "🔧" },
            { name: "Tech Laptop Solutions", address: "Virus removal & upgrade", phone: "014-5678901", distanceText: "3.8 km", shopIcon: "💻" },
            { name: "iFix Laptop Specialist", address: "Affordable laptop repair", phone: "011-6789012", distanceText: "4.2 km", shopIcon: "🔧" }
        ];
        
        $('#resultsCount').html(`📊 ${mockShops.length} laptop shop(s) found (sample data)`);
        $('#shopsList').html(`<div class="info-message">⚠️ Using sample data. Enable location for real shops near you!</div>`);
        
        let html = '';
        for (let shop of mockShops) {
            html += `
                <div class="shop-card">
                    <div class="shop-header">
                        <div class="shop-name">${shop.shopIcon} ${shop.name}</div>
                        <div class="shop-distance-badge">${shop.distanceText}</div>
                    </div>
                    <div class="shop-address">📍 ${shop.address}</div>
                    <div class="shop-contact">📞 ${shop.phone}</div>
                    <div class="shop-hours">🕐 10AM - 8PM</div>
                    <div class="shop-footer">
                        <button class="direction-btn-mock" data-name="${shop.name}">
                            🧭 Get Directions
                        </button>
                    </div>
                </div>
            `;
        }
        $('#shopsList').append(html);
        
        $('.direction-btn-mock').on('click', function() {
            alert('📍 Directions available when location is enabled.');
        });
    }
    
    // ========================================
    // NO SHOPS FOUND
    // ========================================
    
    function showNoShopsFound(location, radius) {
        $('#resultsCount').html('');
        $('#shopsList').html(`
            <div class="no-shops-found">
                <div class="no-shops-icon">🔍😔</div>
                <div class="no-shops-title">No laptop shops found</div>
                <div class="no-shops-message">
                    We couldn't find any laptop repair shops within ${radius} km of "${location}".<br><br>
                    💡 Try:<br>
                    • Increase the search radius to 5km or 10km<br>
                    • Search for a different area<br>
                    • Try again later (data may be limited)
                </div>
                <button class="retry-btn" onclick="location.reload()">🔄 Try Again</button>
            </div>
        `);
    }
    
});