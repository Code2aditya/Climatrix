import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/tree_provider.dart';
import '../../widgets/glass_bottom_nav_bar.dart';
import 'tree_registration_screen.dart';
import 'tree_inspection_screen.dart';
import 'sync_queue_screen.dart';
import '../customer/interactive_gis_map_screen.dart';
import '../common/settings_screen.dart';

class FieldDashboardScreen extends StatefulWidget {
  const FieldDashboardScreen({super.key});

  @override
  State<FieldDashboardScreen> createState() => _FieldDashboardScreenState();
}

class _FieldDashboardScreenState extends State<FieldDashboardScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final tree = Provider.of<TreeProvider>(context, listen: false);
      tree.fetchTrees(auth.selectedTenant?.id ?? 'org-jalandhar-mc');
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final tree = Provider.of<TreeProvider>(context);

    final List<Widget> pages = [
      _buildHomeContent(context, auth, tree),
      const InteractiveGisMapScreen(),
      const SyncQueueScreen(),
      const SettingsScreen(),
    ];

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: pages[_currentIndex],
        ),
      ),
      bottomNavigationBar: GlassBottomNavBar(
        currentIndex: _currentIndex,
        onTap: (idx) => setState(() => _currentIndex = idx),
        items: const [
          GlassBottomNavItem(icon: Icons.badge_rounded, label: 'Portal'),
          GlassBottomNavItem(icon: Icons.map_rounded, label: 'GIS Map'),
          GlassBottomNavItem(icon: Icons.sync, label: 'Sync Queue'),
          GlassBottomNavItem(icon: Icons.settings, label: 'Settings'),
        ],
      ),
    );
  }

  Widget _buildHomeContent(BuildContext context, AuthProvider auth, TreeProvider tree) {
    return Column(
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Field Worker Portal',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Inspector: ${auth.currentUser?.fullName ?? "Gurpreet Singh"}',
                    style: const TextStyle(color: Color(0xFF10B981), fontSize: 12),
                  ),
                ],
              ),
              Row(
                children: [
                  // Offline Sync Badge Button
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SyncQueueScreen()),
                      );
                    },
                    child: GlassCard(
                      borderRadius: 14,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      opacity: 0.25,
                      border: Border.all(
                        color: tree.pendingSyncCount > 0
                            ? const Color(0xFFF59E0B)
                            : const Color(0xFF10B981),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.sync,
                            color: tree.pendingSyncCount > 0
                                ? const Color(0xFFFBBF24)
                                : const Color(0xFF10B981),
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${tree.pendingSyncCount} Queue',
                            style: TextStyle(
                              color: tree.pendingSyncCount > 0
                                  ? const Color(0xFFFBBF24)
                                  : const Color(0xFFA7F3D0),
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: GlassCard(
                      borderRadius: 12,
                      padding: const EdgeInsets.all(8),
                      opacity: 0.2,
                      child: const Icon(Icons.settings, color: Colors.white, size: 20),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SettingsScreen()),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),

        // Action Buttons Row
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              Expanded(
                child: GlassButton(
                  text: '+ Register Tree',
                  icon: Icons.add_a_photo_rounded,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const TreeRegistrationScreen()),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GlassButton(
                  text: 'Offline Queue',
                  icon: Icons.cloud_upload_outlined,
                  gradient: GlassmorphismTheme.cyberAmberGradient,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SyncQueueScreen()),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Assigned Trees List Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Monitored Saplings Register',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${tree.trees.length} Trees Monitored',
                style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12),
              ),
            ],
          ),
        ),

        Expanded(
          child: tree.isLoading
              ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: tree.trees.length,
                  itemBuilder: (context, index) {
                    final t = tree.trees[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: GlassCard(
                        borderRadius: 18,
                        padding: const EdgeInsets.all(16),
                        opacity: 0.15,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      t.treeUniqueTag,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${t.speciesName} (${t.botanicalName})',
                                      style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12),
                                    ),
                                  ],
                                ),
                                HeatStatusBadge(status: t.status),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Location GPS: ${t.lat.toStringAsFixed(4)}, ${t.lng.toStringAsFixed(4)}',
                              style: const TextStyle(color: Colors.white60, fontSize: 11),
                            ),
                            const SizedBox(height: 12),
                            GlassButton(
                              text: 'Log Field Inspection',
                              icon: Icons.fact_check_outlined,
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => TreeInspectionScreen(tree: t),
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
