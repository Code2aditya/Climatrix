import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../providers/species_provider.dart';

class LlmDecisionView extends StatefulWidget {
  const LlmDecisionView({super.key});

  @override
  State<LlmDecisionView> createState() => _LlmDecisionViewState();
}

class _LlmDecisionViewState extends State<LlmDecisionView> {
  final _promptController = TextEditingController(
    text: 'Evaluate Rainak Bazaar (Ward 14) for extreme 48°C summer heat intervention where street width is < 4 meters.',
  );

  @override
  Widget build(BuildContext context) {
    final speciesProvider = Provider.of<SpeciesProvider>(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFA855F7).withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFA855F7)),
              ),
              child: const Icon(Icons.psychology, color: Color(0xFFC084FC), size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'AI LLM Cognitive Decision Engine',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Generative Microclimate Reasoning & Species Feasibility',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.7),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Prompt Input Card
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.16,
          border: Border.all(color: const Color(0xFFA855F7).withValues(alpha: 0.4)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Custom Urban Microclimate Query Prompt',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _promptController,
                maxLines: 3,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white.withValues(alpha: 0.08),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              GlassButton(
                text: 'Generate AI Cognitive Advisory',
                icon: Icons.auto_awesome,
                gradient: GlassmorphismTheme.auroraBlueGradient,
                isLoading: speciesProvider.isLoading,
                onPressed: () async {
                  await speciesProvider.fetchLlmDecision(
                    wardId: 'ward-14',
                    customPrompt: _promptController.text,
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Generated Advisory Output
        if (speciesProvider.llmAdvisory != null)
          GlassCard(
            borderRadius: 22,
            padding: const EdgeInsets.all(18),
            opacity: 0.18,
            border: Border.all(color: const Color(0xFF10B981)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'AI Ward Climate Advisory Response',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  speciesProvider.llmAdvisory!['advisory'] ??
                      'Rainak Bazaar (Ward 14) exhibits severe Land Surface Temperature (47.8°C) and an extreme UHI trap of +11.3°C. Due to 3m road clearance and underground utilities, ground tree planting is unfeasible. Recommended action: Deploy High-Albedo Cool Roofs (SRI > 82) and suspended tensile shade sails.',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 13, height: 1.5),
                ),
              ],
            ),
          )
        else
          GlassCard(
            borderRadius: 20,
            padding: const EdgeInsets.all(18),
            opacity: 0.12,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.lightbulb_outline, color: Color(0xFFFBBF24), size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Default Cognitive Advisory: Rainak Bazaar (Ward 14)',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  'Rainak Bazaar exhibits severe Land Surface Temperature (47.8°C) and an extreme UHI trap of +11.3°C. Ground tree planting is unfeasible due to underground utilities. Immediate solution: Deploy High-Albedo Cool Roofs (SRI > 82) & Suspended Shade Canopies.',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.80), fontSize: 12, height: 1.4),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
