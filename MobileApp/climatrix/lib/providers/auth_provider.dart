import 'package:flutter/material.dart';
import '../core/auth/auth_service.dart';
import '../core/services/api_service.dart';
import '../models/user_model.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  UserModel? _currentUser;
  UserModel? get currentUser => _currentUser;

  UserPersona _activePersona = PRESET_PERSONAS[1]; // Harpreet Kaur IAS
  UserPersona get activePersona => _activePersona;

  List<TenantModel> _tenants = [];
  List<TenantModel> get tenants => _tenants;

  TenantModel? _selectedTenant;
  TenantModel? get selectedTenant => _selectedTenant;

  String _currentRole = 'ANALYST';
  String get currentRole => _currentRole;

  bool get isAuthenticated => _currentUser != null;

  Future<void> initAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      _tenants = await _apiService.fetchTenants();
      if (_tenants.isNotEmpty) {
        _selectedTenant = _tenants.first;
      }

      final savedUser = await AuthService.getUser();
      if (savedUser != null) {
        _currentUser = savedUser;
        _currentRole = savedUser.role;
      }
    } catch (e) {
      debugPrint('Auth init error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectTenant(TenantModel tenant) {
    _selectedTenant = tenant;
    notifyListeners();
  }

  void switchPersona(UserPersona persona) {
    _activePersona = persona;
    _currentRole = persona.role;
    if (_currentUser != null) {
      _currentUser = UserModel(
        id: persona.id,
        organisationId: persona.orgSlug,
        email: persona.email,
        fullName: persona.name,
        role: persona.role,
        orgSlug: persona.orgSlug,
      );
    }
    notifyListeners();
  }

  Future<bool> loginPersona(UserPersona persona) async {
    _isLoading = true;
    notifyListeners();

    try {
      _activePersona = persona;
      final orgId = persona.orgSlug;
      final user = UserModel(
        id: persona.id,
        organisationId: orgId,
        email: persona.email,
        fullName: persona.name,
        role: persona.role,
        orgSlug: persona.orgSlug,
      );

      _currentUser = user;
      _currentRole = persona.role;

      await AuthService.saveSession(
        token: 'jwt_bearer_token_${persona.id}_${DateTime.now().millisecondsSinceEpoch}',
        user: user,
        orgId: orgId,
      );

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login({
    required String email,
    required String password,
    required String role,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      String resolvedRole = role;
      final lowerEmail = email.toLowerCase();
      if (lowerEmail.contains('field') || lowerEmail.contains('inspector')) {
        resolvedRole = 'FIELD_WORKER';
      } else if (lowerEmail.contains('manager') || lowerEmail.contains('executive') || lowerEmail.contains('admin')) {
        resolvedRole = 'ORG_ADMIN';
      } else if (lowerEmail.contains('analyst')) {
        resolvedRole = 'ANALYST';
      }

      final orgId = _selectedTenant?.id ?? 'org-jalandhar-mc';
      final user = UserModel(
        id: 'user-${DateTime.now().millisecondsSinceEpoch}',
        organisationId: orgId,
        email: email,
        fullName: email.split('@').first.replaceAll('.', ' ').toUpperCase(),
        role: resolvedRole,
      );

      _currentUser = user;
      _currentRole = resolvedRole;

      await AuthService.saveSession(
        token: 'jwt_bearer_token_climatrix_${DateTime.now().millisecondsSinceEpoch}',
        user: user,
        orgId: orgId,
      );

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await AuthService.clearSession();
    _currentUser = null;
    notifyListeners();
  }
}
