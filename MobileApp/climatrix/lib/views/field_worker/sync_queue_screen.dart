import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/tree_provider.dart';

class SyncQueueScreen extends StatefulWidget {
  const SyncQueueScreen({super.key});

  @override
  State<SyncQueueScreen> createState() => _SyncQueueScreenState();
}

class _SyncQueueScreenState extends State<SyncQueueScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<TreeProvider>(context, listen: false).refreshPendingQueue();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final tree = Provider.of<TreeProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Offline Sync Manager',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              // Queue Summary Box
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: GlassCard(
                  borderRadius: 20,
                  opacity: 0.18,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Local SQLite Queue',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: tree.pendingSyncCount > 0
                                  ? const Color(0xFFF59E0B).withValues(alpha: 0.3)
                                  : const Color(0xFF10B981).withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${tree.pendingSyncCount} Items',
                              style: TextStyle(
                                color: tree.pendingSyncCount > 0
                                    ? const Color(0xFFFBBF24)
                                    : const Color(0xFFA7F3D0),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          )
                        ],
                      ),
                      const SizedBox(height: 12),
                      GlassButton(
                        text: 'Synchronise All Records Now',
                        icon: Icons.sync,
                        isLoading: tree.isLoading,
                        onPressed: () async {
                          final count = await tree.syncOfflineQueue(
                            auth.selectedTenant?.id ?? 'org-jalandhar-mc',
                          );
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Synchronized $count items with central server!'),
                                backgroundColor: const Color(0xFF10B981),
                              ),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // List of Queue Items
              Expanded(
                child: tree.pendingSyncCount == 0
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.cloud_done, color: Color(0xFF10B981), size: 64),
                            const SizedBox(height: 12),
                            const Text(
                              'Queue is empty!',
                              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'All field records are synchronized with central PostgreSQL.',
                              style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 12),
                            ),
                          ],
                        ),
                      )
                    : ListView(
                        padding: const EdgeInsets.all(16),
                        children: [
                          ...tree.pendingTrees.map((pt) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: GlassCard(
                                borderRadius: 16,
                                opacity: 0.15,
                                child: ListTile(
                                  leading: const Icon(Icons.park, color: Color(0xFF10B981)),
                                  title: Text(
                                    'Tree Registration: ${pt['species_name']}',
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                  subtitle: Text(
                                    'GPS: ${pt['lat']}, ${pt['lng']} • Status: ${pt['sync_status']}',
                                    style: const TextStyle(color: Colors.white60, fontSize: 12),
                                  ),
                                ),
                              ),
                            );
                          }),
                          ...tree.pendingInspections.map((pi) {
                            return Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: GlassCard(
                                borderRadius: 16,
                                opacity: 0.15,
                                child: ListTile(
                                  leading: const Icon(Icons.fact_check, color: Color(0xFF38BDF8)),
                                  title: Text(
                                    'Inspection: ${pi['tree_tag']} (${pi['milestone']})',
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                  subtitle: Text(
                                    'Rating: ${pi['health_rating']}/5 Stars • Height: ${pi['height_cm']}cm',
                                    style: const TextStyle(color: Colors.white60, fontSize: 12),
                                  ),
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
