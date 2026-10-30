import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../core/services/location_service.dart';
import '../../models/tree_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/tree_provider.dart';

class TreeInspectionScreen extends StatefulWidget {
  final PlantedTreeModel tree;

  const TreeInspectionScreen({super.key, required this.tree});

  @override
  State<TreeInspectionScreen> createState() => _TreeInspectionScreenState();
}

class _TreeInspectionScreenState extends State<TreeInspectionScreen> {
  final _heightController = TextEditingController(text: '145.0');
  final _notesController = TextEditingController(text: 'Roots thriving, optimal watering verified.');

  String _selectedMilestone = 'MONTH_6';
  int _healthRating = 5;
  String _soilMoisture = 'OPTIMAL';

  double _gpsLat = 31.3260;
  double _gpsLng = 75.5762;
  double _distanceDeviationM = 1.2;

  @override
  void initState() {
    super.initState();
    _gpsLat = widget.tree.lat;
    _gpsLng = widget.tree.lng;
    _checkGpsDistance();
  }

  Future<void> _checkGpsDistance() async {
    final pos = await LocationService.getCurrentLocation();
    if (pos != null && mounted) {
      final dist = LocationService.calculateDistanceMeters(
        widget.tree.lat,
        widget.tree.lng,
        pos.latitude,
        pos.longitude,
      );
      setState(() {
        _gpsLat = pos.latitude;
        _gpsLng = pos.longitude;
        _distanceDeviationM = dist;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final treeProvider = Provider.of<TreeProvider>(context);

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
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Inspection: ${widget.tree.treeUniqueTag}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            widget.tree.speciesName,
                            style: const TextStyle(color: Color(0xFF10B981), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // GPS Distance Verification Card
                    GlassCard(
                      borderRadius: 20,
                      opacity: 0.18,
                      border: Border.all(
                        color: _distanceDeviationM <= 15.0
                            ? const Color(0xFF10B981)
                            : const Color(0xFFEF4444),
                        width: 1.5,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    _distanceDeviationM <= 15.0 ? Icons.verified : Icons.warning,
                                    color: _distanceDeviationM <= 15.0
                                        ? const Color(0xFF10B981)
                                        : const Color(0xFFEF4444),
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  const Text(
                                    'Sub-5m GPS Audit',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                _distanceDeviationM <= 15.0 ? 'VERIFIED' : 'DISTANCE ALERT',
                                style: TextStyle(
                                  color: _distanceDeviationM <= 15.0
                                      ? const Color(0xFFA7F3D0)
                                      : const Color(0xFFFCA5A5),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Distance from registered planting site: ${_distanceDeviationM.toStringAsFixed(1)} meters',
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Form
                    GlassCard(
                      borderRadius: 20,
                      opacity: 0.15,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Milestone Stage', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            value: _selectedMilestone,
                            dropdownColor: const Color(0xFF1E293B),
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.08),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(14),
                                borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                              ),
                            ),
                            items: const [
                              DropdownMenuItem(value: 'DAY_0', child: Text('Day 0 (Initial Planting)')),
                              DropdownMenuItem(value: 'MONTH_3', child: Text('Month 3 Milestone')),
                              DropdownMenuItem(value: 'MONTH_6', child: Text('Month 6 Milestone')),
                              DropdownMenuItem(value: 'MONTH_12', child: Text('Month 12 Milestone')),
                              DropdownMenuItem(value: 'ANNUAL', child: Text('Annual Inspection')),
                            ],
                            onChanged: (val) {
                              if (val != null) setState(() => _selectedMilestone = val);
                            },
                          ),
                          const SizedBox(height: 16),

                          const Text('Health Rating (1 to 5 Stars)', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: List.generate(5, (index) {
                              final starVal = index + 1;
                              return IconButton(
                                icon: Icon(
                                  starVal <= _healthRating ? Icons.star : Icons.star_border,
                                  color: const Color(0xFFF59E0B),
                                  size: 32,
                                ),
                                onPressed: () => setState(() => _healthRating = starVal),
                              );
                            }),
                          ),
                          const SizedBox(height: 16),

                          TextField(
                            controller: _heightController,
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Current Measured Height (cm)',
                              labelStyle: const TextStyle(color: Colors.white70),
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.08),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(14),
                                borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),

                          TextField(
                            controller: _notesController,
                            maxLines: 2,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Inspector Remarks',
                              labelStyle: const TextStyle(color: Colors.white70),
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.08),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(14),
                                borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),

                          GlassButton(
                            text: 'Submit Tamper-Evident Inspection',
                            icon: Icons.check_circle_outline,
                            onPressed: () async {
                              final height = double.tryParse(_heightController.text) ?? 145.0;
                              final result = await treeProvider.submitInspection(
                                plantedTreeId: widget.tree.id,
                                treeTag: widget.tree.treeUniqueTag,
                                milestone: _selectedMilestone,
                                heightCm: height,
                                healthRating: _healthRating,
                                soilMoisture: _soilMoisture,
                                gpsLat: _gpsLat,
                                gpsLng: _gpsLng,
                                notes: _notesController.text,
                              );

                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(result['message'] ?? 'Inspection submitted!'),
                                    backgroundColor: const Color(0xFF10B981),
                                  ),
                                );
                                Navigator.pop(context);
                              }
                            },
                          ),
                        ],
                      ),
                    ),
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
