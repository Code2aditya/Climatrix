class ApiConfig {
  // Primary backend URL connected to D:\cthack2.0\backend
  // Android Emulator uses 10.0.2.2, Web/Desktop uses localhost, Physical device uses LAN IP
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';
  static const String fallbackBaseUrl = 'http://127.0.0.1:8000/api/v1';

  // API Endpoints
  static const String health = '/health';
  static const String pilotInfo = '/pilot-info';
  static const String realtimeWeather = '/weather/realtime';
  static const String tenants = '/tenants';
  static const String wards = '/locations/wards';
  static const String secureWardDetails = '/locations';
  static const String species = '/species';
  static const String recommendSpecies = '/species/recommend';
  static const String llmDecision = '/llm/decision-making';
  static const String coolingRecommendations = '/cooling-recommendations';
  static const String trees = '/trees';
  static const String inspections = '/trees/inspections';
}
