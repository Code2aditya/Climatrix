# Jalandhar Pilot Ward GIS & Climate Baseline Dataset
**City:** Jalandhar, Punjab, India  
**Municipal Authority:** Municipal Corporation Jalandhar (MCJ)  
**Total Administrative Wards:** 80  
**Pilot Coordinates:** Lat 31.3260° N, Lng 75.5762° E  
**Agro-Climatic Zone:** Central Plain Zone of Punjab (Semi-Arid, Sub-Tropical)  

---

## 1. High-Priority Hyperlocal Micro-Climatic Clusters

| Cluster Name | Key Wards | Dominant Land Cover | Mean Summer LST (°C) | Mean NDVI | Primary Intervention Recommendation |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Old City Commercial Core** | Wards 12, 14, 15, 18 (Rainak Bazaar, Jyoti Chowk, Phagwara Gate) | 92% Concrete/Roofing, <3% Tree Canopy | 45.8°C – 48.2°C | 0.08 | **Alternative Cooling:** Cool Roofs ($SRI > 80$), High-tensile pedestrian shade sails, vertical living facades. *Ground plantation unsuitable due to dense paving & underground drainage lines.* |
| **Industrial / Logistics Zone** | Wards 22, 24, 28, 30 (Focal Point, Leather Complex, Transport Nagar) | Metal roofs, heavy vehicle bitumen corridors, industrial boiler heat | 46.5°C – 49.1°C | 0.06 | **Heavy Buffer Plantations:** Native deep-rooted trees along boundary strips (*Azadirachta indica*, *Terminalia arjuna*), permeable pavements, reflective industrial roof coatings. |
| **Dense Residential Bastis** | Wards 37, 39, 41, 44 (Basti Sheikh, Basti Guzan, Basti Nau) | High-density 2-3 storey brick/masonry, narrow 4m-6m alleys | 42.4°C – 44.9°C | 0.12 | **Targeted Pocket Parks & Green Walls:** Small-canopy native flowering trees (*Bauhinia variegata*), terrace greenery, school yard cooling. |
| **Suburban Arterial Corridors** | Wards 52, 55, 58, 62 (Rama Mandi, Pathankot Bypass, GT Road) | Wide highway rights-of-way, mixed commercial frontage | 41.0°C – 43.5°C | 0.18 | **Multi-Tiered Avenue Green Belts:** Tall canopy trees for noise & particulate filtration (*Dalbergia sissoo*, *Alstonia scholaris*, *Ficus virens*). |
| **Institutional & Garden Suburbs** | Wards 4, 7, 68, 74 (Model Town, Cantt Environs, NIT / GNDU Campus) | Planned residential, institutional open grounds | 36.8°C – 39.5°C | 0.38 | **Benchmark Carbon Sinks:** Micro-forests (Miyawaki clusters), dense biodiversity groves, groundwater recharge bioswales. |

---

## 2. Punjab Native & Climate-Resilient Botanical Database

| Species Botanical Name | Common Name (Punjabi / Hindi) | Heat Tolerance Max | Drought Rating (1-5) | Water Need (L/day) | Mature Canopy Radius | Rooting Behavior | Best Suited Sites |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| *Azadirachta indica* | Neem (ਨਿੰਮ) | 48°C | 5 | 10 – 15 | 7.0 m | Deep Taproot | Institutional grounds, wide avenues, industrial boundaries. High air purification index. |
| *Dalbergia sissoo* | Tahli / Shisham (ਟਾਹਲੀ) | 47°C | 4 | 15 – 25 | 6.5 m | Deep Taproot | State tree of Punjab. Highway strips, canal banks, public parks. Excellent nitrogen fixer. |
| *Vachellia nilotica* (Acacia) | Kikar / Babool (ਕਿੱਕਰ) | 49°C | 5 | 5 – 10 | 5.0 m | Very Deep Taproot | Barren wastelands, peri-urban heat hotspots, drought-prone soils. Minimum maintenance. |
| *Terminalia arjuna* | Arjun (ਅਰਜੁਨ) | 46°C | 3 | 25 – 40 | 8.0 m | Spreading & Deep | Waterbody edges, park perimeters, low-lying storm drainage corridors. High carbon sequestration. |
| *Ficus religiosa* | Peepal (ਪਿੱਪਲ) | 48°C | 5 | 15 – 20 | 10.0 m | Extensive Invasive | Open temple grounds, broad rural/peri-urban junctions. *Avoid near narrow buildings/pipes.* |
| *Bauhinia variegata* | Kachnar (ਕਚਨਾਰ) | 44°C | 4 | 10 – 18 | 4.0 m | Moderate Compact | Narrow residential streets, school yards, medium park borders. Non-destructive roots. |
| *Phyllanthus emblica* | Amla (ਔਂਵਲਾ) | 45°C | 4 | 12 – 20 | 4.5 m | Compact Deep | Community nutrition gardens, institutional parks, urban food forests. |
| *Morus alba* | Toot (ਤੂਤ) | 45°C | 4 | 15 – 25 | 5.5 m | Moderate | Urban shaded pedestrian walkways, school campus perimeter. High bird biodiversity. |

---

## 3. Remote Sensing Processing Parameters
- **Sensor:** Landsat 9 TIRS-2 (Band 10 - 10.60–11.19 µm) & OLI-2 (Bands 4 & 5).
- **NDVI Formula:** $(\text{Band 5} - \text{Band 4}) / (\text{Band 5} + \text{Band 4})$
- **LST Calculation Standard:** USGS Single-Channel Method with Radiative Transfer Equation:
  $$LST = \frac{T_B}{1 + \left(\frac{\lambda \cdot T_B}{\rho}\right) \cdot \ln(\epsilon)}$$
  Where:
  - $T_B$ = At-sensor brightness temperature (Kelvin)
  - $\lambda$ = Wavelength of emitted radiance (10.895 µm)
  - $\rho = h \cdot \frac{c}{\sigma} = 1.438 \times 10^{-2} \text{ m}\cdot\text{K}$
  - $\epsilon$ = Land Surface Emissivity derived from Fractional Vegetation Cover ($FVC$).
