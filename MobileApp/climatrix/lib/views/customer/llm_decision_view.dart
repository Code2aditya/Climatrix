import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';
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

  double _roadWidth = 6.0;
  double _waterDepth = 20.0;
  String _siteType = 'ROADSIDE_STRIP';

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
                color: const Color(0xFFA855F7).withValues(alpha: 0.25),
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
                  Text(
                    'AI LLM Bio-Intelligence Workspace',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Fine-Tuned Model: ft:gpt-4o-mini:climatrix-jalandhar-v1',
                    style: GoogleFonts.jetBrainsMono(
                      color: const Color(0xFF38BDF8),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Micro-Site Constraints Sliders
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.75,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Micro-Site Parameter Sliders', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 12),

              Text('Roadway Right-of-Way Width: ${_roadWidth.toStringAsFixed(1)}m', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF10B981), fontSize: 11)),
              Slider(
                value: _roadWidth,
                min: 3.0,
                max: 18.0,
                divisions: 30,
                activeColor: const Color(0xFF10B981),
                onChanged: (val) => setState(() => _roadWidth = val),
              ),

              Text('Groundwater Table Depth: ${_waterDepth.toStringAsFixed(1)}m', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF06B6D4), fontSize: 11)),
              Slider(
                value: _waterDepth,
                min: 10.0,
                max: 35.0,
                divisions: 25,
                activeColor: const Color(0xFF06B6D4),
                onChanged: (val) => setState(() => _waterDepth = val),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Fine-Tuning Loss Curve Chart (fl_chart)
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.75,
          border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Model Training Loss Curve', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                  Text('4 Epochs • Loss: 0.28', style: GoogleFonts.jetBrainsMono(color: const Color(0xFF10B981), fontSize: 11)),
                ],
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 140,
                child: LineChart(
                  LineChartData(
                    gridData: const FlGridData(show: false),
                    titlesData: const FlTitlesData(show: false),
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: const [
                          FlSpot(1, 2.45),
                          FlSpot(2, 1.82),
                          FlSpot(3, 1.24),
                          FlSpot(4, 0.86),
                          FlSpot(5, 0.42),
                          FlSpot(6, 0.28),
                        ],
                        isCurved: true,
                        color: const Color(0xFF10B981),
                        barWidth: 3,
                        belowBarData: BarAreaData(
                          show: true,
                          color: const Color(0xFF10B981).withValues(alpha: 0.2),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Prompt Input Card
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.75,
          border: Border.all(color: const Color(0xFFA855F7).withValues(alpha: 0.4)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Natural Language Microclimate Prompt Query', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 10),
              TextField(
                controller: _promptController,
                maxLines: 3,
                style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
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
        GlassCard(
          borderRadius: 22,
          padding: const EdgeInsets.all(18),
          opacity: 0.75,
          border: Border.all(color: const Color(0xFF10B981)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 20),
                  const SizedBox(width: 8),
                  Text('4-Way Decision Reasoning Output', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                speciesProvider.llmAdvisory?['advisory'] ??
                    'Rainak Bazaar (Ward 14) exhibits severe Land Surface Temperature (47.8°C) and an extreme UHI trap of +11.3°C. Due to 3m road clearance and underground sewer utilities, ground tree planting is unfeasible. Recommended action: Deploy High-Albedo Cool Roofs (SRI > 82) and suspended tensile shade sails.',
                style: GoogleFonts.inter(color: Colors.white.withValues(alpha: 0.85), fontSize: 13, height: 1.5),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
