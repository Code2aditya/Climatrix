import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../customer/customer_dashboard_screen.dart';
import '../field_worker/field_dashboard_screen.dart';
import '../manager/manager_dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _emailController = TextEditingController(text: 'commissioner@mcjalandhar.gov.in');
  final _passwordController = TextEditingController(text: 'MCJAdmin2026!');
  UserPersona _selectedPersona = PRESET_PERSONAS[1]; // Default: Harpreet Kaur IAS

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onPersonaSelect(UserPersona persona) {
    setState(() {
      _selectedPersona = persona;
      _emailController.text = persona.email;
    });
  }

  void _navigateToRoleDashboard(BuildContext context, String role) {
    if (role == 'FIELD_WORKER') {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const FieldDashboardScreen()),
      );
    } else if (role == 'ORG_ADMIN' || role == 'SUPER_ADMIN') {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const ManagerDashboardScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const CustomerDashboardScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 520),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // App Brand Logo & Title Header
                        Column(
                          children: [
                            GlassCard(
                              borderRadius: 24,
                              padding: const EdgeInsets.all(16),
                              opacity: 0.20,
                              border: Border.all(
                                color: const Color(0xFF10B981).withValues(alpha: 0.4),
                                width: 1.5,
                              ),
                              child: const Icon(
                                Icons.thermostat_auto_rounded,
                                size: 44,
                                color: Color(0xFF10B981),
                              ),
                            ),
                            const SizedBox(height: 12),
                            ShaderMask(
                              shaderCallback: (bounds) => GlassmorphismTheme.emeraldGradient.createShader(bounds),
                              child: const Text(
                                'CLIMATRIX',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2.0,
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Smart Urban Heat & Climate Resilience Portal',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.8),
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'Pilot Region: Jalandhar Municipal Corporation (80 Wards)',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Color(0xFF38BDF8),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Login Card Container
                        GlassCard(
                          borderRadius: 24,
                          padding: const EdgeInsets.all(18),
                          opacity: 0.16,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Tab Switcher Header
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.3),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                                ),
                                padding: const EdgeInsets.all(4),
                                child: TabBar(
                                  controller: _tabController,
                                  indicator: BoxDecoration(
                                    color: const Color(0xFF10B981),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  labelColor: Colors.black,
                                  unselectedLabelColor: Colors.white70,
                                  labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                  tabs: const [
                                    Tab(text: '⚡ 1-Click Personas'),
                                    Tab(text: '🔑 Standard Login'),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 16),

                              // Tab View Content
                              SizedBox(
                                height: 380,
                                child: TabBarView(
                                  controller: _tabController,
                                  children: [
                                    // Tab 1: Seeded Personas List
                                    ListView.separated(
                                      itemCount: PRESET_PERSONAS.length,
                                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                                      itemBuilder: (context, idx) {
                                        final persona = PRESET_PERSONAS[idx];
                                        final isSelected = _selectedPersona.id == persona.id;
                                        return InkWell(
                                          onTap: () => _onPersonaSelect(persona),
                                          borderRadius: BorderRadius.circular(16),
                                          child: Container(
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: isSelected
                                                  ? const Color(0xFF10B981).withValues(alpha: 0.22)
                                                  : Colors.white.withValues(alpha: 0.05),
                                              borderRadius: BorderRadius.circular(16),
                                              border: Border.all(
                                                color: isSelected
                                                    ? const Color(0xFF10B981)
                                                    : Colors.white.withValues(alpha: 0.12),
                                                width: isSelected ? 1.5 : 1.0,
                                              ),
                                            ),
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    CircleAvatar(
                                                      radius: 16,
                                                      backgroundColor: const Color(0xFF10B981).withValues(alpha: 0.3),
                                                      child: Text(
                                                        persona.avatarText,
                                                        style: const TextStyle(
                                                          color: Color(0xFF10B981),
                                                          fontWeight: FontWeight.bold,
                                                          fontSize: 11,
                                                        ),
                                                      ),
                                                    ),
                                                    const SizedBox(width: 10),
                                                    Expanded(
                                                      child: Column(
                                                        crossAxisAlignment: CrossAxisAlignment.start,
                                                        children: [
                                                          Text(
                                                            persona.name,
                                                            style: const TextStyle(
                                                              color: Colors.white,
                                                              fontWeight: FontWeight.bold,
                                                              fontSize: 13,
                                                            ),
                                                            maxLines: 1,
                                                            overflow: TextOverflow.ellipsis,
                                                          ),
                                                          Text(
                                                            persona.organisation,
                                                            style: const TextStyle(
                                                              color: Colors.white60,
                                                              fontSize: 10,
                                                            ),
                                                            maxLines: 1,
                                                            overflow: TextOverflow.ellipsis,
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                    Container(
                                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                      decoration: BoxDecoration(
                                                        color: const Color(0xFF38BDF8).withValues(alpha: 0.2),
                                                        borderRadius: BorderRadius.circular(6),
                                                      ),
                                                      child: Text(
                                                        persona.role,
                                                        style: const TextStyle(
                                                          color: Color(0xFF38BDF8),
                                                          fontSize: 9,
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                const SizedBox(height: 6),
                                                Text(
                                                  'Licensed: ${persona.licensedWards.join(", ")}',
                                                  style: const TextStyle(
                                                    color: Color(0xFFA7F3D0),
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      },
                                    ),

                                    // Tab 2: Standard Form
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.stretch,
                                      children: [
                                        TextField(
                                          controller: _emailController,
                                          style: const TextStyle(color: Colors.white, fontSize: 13),
                                          decoration: InputDecoration(
                                            labelText: 'Official Email',
                                            labelStyle: const TextStyle(color: Colors.white70, fontSize: 12),
                                            prefixIcon: const Icon(Icons.email, color: Color(0xFF10B981), size: 18),
                                            filled: true,
                                            fillColor: Colors.white.withValues(alpha: 0.08),
                                            border: OutlineInputBorder(
                                              borderRadius: BorderRadius.circular(12),
                                              borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                                            ),
                                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                          ),
                                        ),
                                        const SizedBox(height: 12),
                                        TextField(
                                          controller: _passwordController,
                                          obscureText: true,
                                          style: const TextStyle(color: Colors.white, fontSize: 13),
                                          decoration: InputDecoration(
                                            labelText: 'Password',
                                            labelStyle: const TextStyle(color: Colors.white70, fontSize: 12),
                                            prefixIcon: const Icon(Icons.lock, color: Color(0xFF10B981), size: 18),
                                            filled: true,
                                            fillColor: Colors.white.withValues(alpha: 0.08),
                                            border: OutlineInputBorder(
                                              borderRadius: BorderRadius.circular(12),
                                              borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                                            ),
                                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                          ),
                                        ),
                                        const SizedBox(height: 12),
                                        Container(
                                          padding: const EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.05),
                                            borderRadius: BorderRadius.circular(10),
                                            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                                          ),
                                          child: const Text(
                                            '💡 Seed Password Hint: Use MCJAdmin2026!, AntigravityAdmin2026!, or PGDAdmin2026!',
                                            style: TextStyle(color: Colors.white70, fontSize: 11),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 14),

                              // Submit Button
                              GlassButton(
                                text: 'Authenticate & Enter (${_selectedPersona.name.split(" ").first})',
                                isLoading: auth.isLoading,
                                onPressed: () async {
                                  final success = await auth.loginPersona(_selectedPersona);
                                  if (success && mounted) {
                                    _navigateToRoleDashboard(context, _selectedPersona.role);
                                  }
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
