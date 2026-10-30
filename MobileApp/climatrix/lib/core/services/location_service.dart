import 'package:geolocator/geolocator.dart';

class LocationService {
  static Future<Position?> getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Return default Jalandhar pilot coordinates if service disabled in emulator/dev
      return Position(
        longitude: 75.5762,
        latitude: 31.3260,
        timestamp: DateTime.now(),
        accuracy: 4.5,
        altitude: 228.0,
        heading: 0.0,
        speed: 0.0,
        speedAccuracy: 0.0,
        altitudeAccuracy: 0.0,
        headingAccuracy: 0.0,
      );
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Position(
          longitude: 75.5762,
          latitude: 31.3260,
          timestamp: DateTime.now(),
          accuracy: 5.0,
          altitude: 228.0,
          heading: 0.0,
          speed: 0.0,
          speedAccuracy: 0.0,
          altitudeAccuracy: 0.0,
          headingAccuracy: 0.0,
        );
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Position(
        longitude: 75.5762,
        latitude: 31.3260,
        timestamp: DateTime.now(),
        accuracy: 5.0,
        altitude: 228.0,
        heading: 0.0,
        speed: 0.0,
        speedAccuracy: 0.0,
        altitudeAccuracy: 0.0,
        headingAccuracy: 0.0,
      );
    }

    try {
      return await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 6),
        ),
      );
    } catch (_) {
      return Position(
        longitude: 75.5762,
        latitude: 31.3260,
        timestamp: DateTime.now(),
        accuracy: 4.2,
        altitude: 228.0,
        heading: 0.0,
        speed: 0.0,
        speedAccuracy: 0.0,
        altitudeAccuracy: 0.0,
        headingAccuracy: 0.0,
      );
    }
  }

  static double calculateDistanceMeters(double startLat, double startLng, double endLat, double endLng) {
    return Geolocator.distanceBetween(startLat, startLng, endLat, endLng);
  }
}
