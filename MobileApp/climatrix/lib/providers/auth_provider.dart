import 'package:flutter/material.dart';
import '../core/auth/auth_service.dart';
import '../core/services/api_service.dart';
import '../models/user_model.dart';

final List<TenantModel> SEED_TENANTS = [
  TenantModel(
    id: 'mcjalandhar',
    name: 'Municipal Corporation Jalandhar (MCJ)',
    slug: 'mcjalandhar',
    orgType: 'MUNICIPAL',
    contactEmail: 'commissioner@mcjalandhar.gov.in',
    licensedLocationIds: ['ward-04', 'ward-14', 'ward-18', 'ward-37', 'ward-55', 'ward-68'],
  ),
  TenantModel(
    id: 'pgd-infra',
    name: 'Punjab Green Developers Ltd (PGD)',
    slug: 'pgd-infra',
    orgType: 'DEVELOPER',
    contactEmail: 'sustainability@pgd-infra.in',
    licensedLocationIds: ['ward-22', 'ward-68'],
  ),
];

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  UserModel? _currentUser;
  UserModel? get currentUser => _currentUser;

  UserPersona _activePersona = PRESET_PERSONAS[1]; // Harpreet Kaur IAS
  UserPersona get activePersona => _activePersona;

  List<TenantModel> _tenants = List.from(SEED_TENANTS);
  List<TenantModel> get tenants => _tenants;

  TenantModel? _selectedTenant = SEED_TENANTS.first;
  TenantModel? get selectedTenant => _selectedTenant;

  String _currentRole = 'ANALYST';
  String get currentRole => _currentRole;

  bool get isAuthenticated => _currentUser != null;

  AuthProvider() {
    _tenants = List.from(SEED_TENANTS);
    _selectedTenant = _tenants.first;
  }

  Future<void> initAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final fetched = await _apiService.fetchTenants();
      if (fetched.isNotEmpty) {
        _tenants = fetched;
        _selectedTenant = _tenants.first;
      }
    } catch (_) {
      if (_tenants.isEmpty) {
        _tenants = List.from(SEED_TENANTS);
        _selectedTenant = _tenants.first;
      }
    }

    try {
      final savedUser = await AuthService.getUser();
      if (savedUser != null) {
        _currentUser = savedUser;
        _currentRole = savedUser.role;
      }
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
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
