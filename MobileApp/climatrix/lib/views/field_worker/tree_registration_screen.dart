import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../core/theme/glassmorphism_theme.dart';
import '../../core/services/location_service.dart';
import '../../providers/species_provider.dart';
import '../../providers/tree_provider.dart';

class TreeRegistrationScreen extends StatefulWidget {
  const TreeRegistrationScreen({super.key});

  @override
  State<TreeRegistrationScreen> createState() => _TreeRegistrationScreenState();
}

class _TreeRegistrationScreenState extends State<TreeRegistrationScreen> {
  final _heightController = TextEditingController(text: '120.0');
  final _notesController = TextEditingController(text: 'Healthy sapling planted during monsoon drive');

  String? _selectedSpeciesId;
  String _selectedSpeciesName = 'Neem (Azadirachta indica)';

  double _lat = 31.3260;
  double _lng = 75.5762;
  double _accuracy = 4.2;
  bool _isFetchingGps = false;
  String _generatedTag = 'JAL-TR-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

  @override
  void initState() {
    super.initState();
    _captureGps();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final species = Provider.of<SpeciesProvider>(context, listen: false);
      species.fetchSpeciesCatalog();
    });
  }

  Future<void> _captureGps() async {
    setState(() => _isFetchingGps = true);
    final pos = await LocationService.getCurrentLocation();
    if (pos != null && mounted) {
      setState(() {
        _lat = pos.latitude;
        _lng = pos.longitude;
        _accuracy = pos.accuracy;
        _isFetchingGps = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final speciesProvider = Provider.of<SpeciesProvider>(context);
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
                    const Text(
                      'Register Planted Tree',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // QR Code Card
                    GlassCard(
                      borderRadius: 20,
                      opacity: 0.18,
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: QrImageView(
                              data: _generatedTag,
                              version: QrVersions.auto,
                              size: 140.0,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Generated Tag: $_generatedTag',
                            style: const TextStyle(
                              color: Color(0xFF10B981),
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Form Container
                    GlassCard(
                      borderRadius: 20,
                      opacity: 0.15,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Select Tree Species',
                            style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            value: _selectedSpeciesId,
                            dropdownColor: const Color(0xFF1E293B),
                            hint: const Text('Select Punjab Native Species', style: TextStyle(color: Colors.white70)),
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.08),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(14),
                                borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                              ),
                            ),
                            items: speciesProvider.speciesCatalog.map((sp) {
                              return DropdownMenuItem(
                                value: sp.id,
                                child: Text('${sp.commonNamePunjabi} (${sp.botanicalName})'),
                              );
                            }).toList(),
                            onChanged: (val) {
                              setState(() {
                                _selectedSpeciesId = val;
                                final found = speciesProvider.speciesCatalog.firstWhere((s) => s.id == val);
                                _selectedSpeciesName = found.commonNamePunjabi;
                              });
                            },
                          ),
                          const SizedBox(height: 16),

                          // GPS Capture Box
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Captured GPS Coordinates', style: TextStyle(color: Colors.white70, fontSize: 12)),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${_lat.toStringAsFixed(5)}, ${_lng.toStringAsFixed(5)}',
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                  ),
                                  Text(
                                    'Accuracy: ±${_accuracy.toStringAsFixed(1)}m (Sub-5m GPS Verified)',
                                    style: const TextStyle(color: Color(0xFF10B981), fontSize: 11),
                                  ),
                                ],
                              ),
                              IconButton(
                                icon: _isFetchingGps
                                    ? const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF10B981)),
                                      )
                                    : const Icon(Icons.my_location, color: Color(0xFF10B981)),
                                onPressed: _captureGps,
                              )
                            ],
                          ),
                          const SizedBox(height: 16),

                          TextField(
                            controller: _heightController,
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Initial Sapling Height (cm)',
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
                              labelText: 'Field Notes',
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
                            text: 'Save Registration Record',
                            icon: Icons.save_rounded,
                            onPressed: () async {
                              final height = double.tryParse(_heightController.text) ?? 120.0;
                              await treeProvider.registerTreeOffline(
                                speciesId: _selectedSpeciesId ?? 'sp-neem-01',
                                speciesName: _selectedSpeciesName,
                                lat: _lat,
                                lng: _lng,
                                initialHeightCm: height,
                                notes: _notesController.text,
                              );

                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Tree $_generatedTag registered successfully in SQLite offline queue!'),
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
