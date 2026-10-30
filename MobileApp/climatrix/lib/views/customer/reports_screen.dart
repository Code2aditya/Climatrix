import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/auth_provider.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const Text(
                'Reports & Subscriptions',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Authorised Municipal Climate Intelligence Downloads',
                style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 12),
              ),
              const SizedBox(height: 20),

              // Active Subscription Card
              GlassCard(
                borderRadius: 22,
                padding: const EdgeInsets.all(20),
                opacity: 0.18,
                border: Border.all(color: const Color(0xFF10B981), width: 1.5),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Municipal Standard Plan',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Org: ${auth.selectedTenant?.name ?? "Jalandhar MC"}',
                              style: const TextStyle(color: Colors.white70, fontSize: 13),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.25),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFF10B981)),
                          ),
                          child: const Text(
                            'ACTIVE',
                            style: TextStyle(
                              color: Color(0xFFA7F3D0),
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 14),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Licensed Wards: 5 Active Wards', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Text('Billing: Annual', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              const Text(
                'Available Climate Reports',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),

              _reportItem(
                title: 'Jalandhar Urban Heat Island Audit 2026',
                subtitle: 'Includes 30m satellite LST analysis, ward vulnerability ranking & heat hotspot map.',
                date: '2026-10-28',
                context: context,
              ),
              _reportItem(
                title: 'AI Native Tree Species Feasibility Matrix',
                subtitle: 'LLM-generated species recommendations for Rainak Bazaar, Model Town & GT Road strips.',
                date: '2026-10-20',
                context: context,
              ),
              _reportItem(
                title: 'Tree Survival & Milestone Audit Report',
                subtitle: 'Tamper-evident 6-month survival statistics for 120 monitored native saplings.',
                date: '2026-10-15',
                context: context,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _reportItem({
    required String title,
    required String subtitle,
    required String date,
    required BuildContext context,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        borderRadius: 18,
        padding: const EdgeInsets.all(16),
        opacity: 0.14,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Text(
                  date,
                  style: const TextStyle(color: Colors.white60, fontSize: 11),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(subtitle, style: TextStyle(color: Colors.white.withValues(alpha: 0.75), fontSize: 12)),
            const SizedBox(height: 12),
            GlassButton(
              text: 'Download Authorised PDF',
              icon: Icons.picture_as_pdf,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Downloading $title...'),
                    backgroundColor: const Color(0xFF10B981),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
