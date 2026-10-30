import 'package:flutter/material.dart';

class LanguageProvider with ChangeNotifier {
  String _currentLanguage = 'en'; // 'en' or 'hi'
  String get currentLanguage => _currentLanguage;

  void toggleLanguage() {
    _currentLanguage = _currentLanguage == 'en' ? 'hi' : 'en';
    notifyListeners();
  }

  void setLanguage(String langCode) {
    _currentLanguage = langCode;
    notifyListeners();
  }

  String translate(String key) {
    if (_currentLanguage == 'hi') {
      return _hindiTranslations[key] ?? key;
    }
    return _englishTranslations[key] ?? key;
  }

  static const Map<String, String> _englishTranslations = {
    'app_title': 'Smart Urban Heat & Climate Resilience',
    'dashboard': 'Dashboard',
    'gis_map': 'Interactive GIS Map',
    'ai_species': 'AI Plantation Engine',
    'cooling': 'Alternative Cooling',
    'reports': 'Reports & Subscriptions',
    'field_dashboard': 'Field Worker Portal',
    'register_tree': 'Register Planted Tree',
    'tree_inspection': 'Milestone Inspection',
    'sync_queue': 'Offline Sync Queue',
    'manager_portal': 'Executive Dashboard',
    'survival_rate': 'Sapling Survival Rate',
    'licensed_wards': 'Licensed Wards',
    'heat_index': 'Heat Index',
    'air_temp': 'Air Temperature',
    'hotspot_status': 'Hotspot Severity',
  };

  static const Map<String, String> _hindiTranslations = {
    'app_title': 'स्मार्ट शहरी गर्मी एवं जलवायु लचीलापन',
    'dashboard': 'डैशबोर्ड',
    'gis_map': 'इंटरएक्टिव जीआईएस मानचित्र',
    'ai_species': 'एआई वृक्षारोपण इंजन',
    'cooling': 'वैकल्पिक शीतलन उपाय',
    'reports': 'रिपोर्ट और सदस्यता',
    'field_dashboard': 'फील्ड कार्यकर्ता पोर्टल',
    'register_tree': 'नया पौधा दर्ज करें',
    'tree_inspection': 'पौधा स्वास्थ्य निरीक्षण',
    'sync_queue': 'ऑफलाइन सिंक कतार',
    'manager_portal': 'कार्यकारी डैशबोर्ड',
    'survival_rate': 'पौधों की उत्तरजीविता दर',
    'licensed_wards': 'लाइसेंस प्राप्त वार्ड',
    'heat_index': 'हीट इंडेक्स',
    'air_temp': 'वायु तापमान',
    'hotspot_status': 'हॉटस्पॉट की स्थिति',
  };
}
