import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../models/user_model.dart';

class AuthService {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static const String _tokenKey = 'jwt_token';
  static const String _userKey = 'user_data';
  static const String _orgKey = 'selected_org_id';

  // Save JWT session
  static Future<void> saveSession({
    required String token,
    required UserModel user,
    required String orgId,
  }) async {
    await _storage.write(key: _tokenKey, value: token);
    await _storage.write(key: _userKey, value: jsonEncode(user.toJson()));
    await _storage.write(key: _orgKey, value: orgId);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  static Future<UserModel?> getUser() async {
    final str = await _storage.read(key: _userKey);
    if (str == null) return null;
    try {
      return UserModel.fromJson(jsonDecode(str));
    } catch (_) {
      return null;
    }
  }

  static Future<String?> getSelectedOrgId() async {
    return await _storage.read(key: _orgKey);
  }

  static Future<void> clearSession() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
    await _storage.delete(key: _orgKey);
  }
}
