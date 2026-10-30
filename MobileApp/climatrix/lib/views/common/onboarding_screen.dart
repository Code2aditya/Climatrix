import 'package:flutter/material.dart';
import '../../core/theme/glassmorphism_theme.dart';
import 'login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _slides = [
    {
      'title': 'Satellite Microclimate Analytics',
      'subtitle': 'Monitor 30m Land Surface Temperature (LST), NDVI vegetation density, and heat island severity across Jalandhar wards.',
      'icon': 'thermostat',
    },
    {
      'title': 'AI Punjab Native Species Engine',
      'subtitle': 'Cognitive LLM decision engine matches drought-resilient native trees (Neem, Shisham, Karanj) based on soil & roadway width.',
      'icon': 'eco',
    },
    {
      'title': 'Offline Field Audit & Sub-5m GPS',
      'subtitle': 'Field workers register saplings with QR tags, record milestone health inspections, and sync records when connectivity returns.',
      'icon': 'satellite_alt',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: GlassmorphismTheme.spaceBackgroundGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'CLIMATRIX',
                      style: TextStyle(
                        color: Color(0xFF10B981),
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                        );
                      },
                      child: const Text('Skip', style: TextStyle(color: Colors.white70)),
                    )
                  ],
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _controller,
                  onPageChanged: (idx) => setState(() => _currentPage = idx),
                  itemCount: _slides.length,
                  itemBuilder: (context, index) {
                    final slide = _slides[index];
                    return Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          GlassCard(
                            borderRadius: 32,
                            padding: const EdgeInsets.all(36),
                            opacity: 0.15,
                            border: Border.all(
                              color: const Color(0xFF10B981).withValues(alpha: 0.3),
                              width: 1.5,
                            ),
                            child: Icon(
                              slide['icon'] == 'thermostat'
                                  ? Icons.thermostat_auto_rounded
                                  : slide['icon'] == 'eco'
                                      ? Icons.nature_people_rounded
                                      : Icons.satellite_alt_rounded,
                              size: 84,
                              color: const Color(0xFF10B981),
                            ),
                          ),
                          const SizedBox(height: 36),
                          Text(
                            slide['title']!,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 14),
                          Text(
                            slide['subtitle']!,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.75),
                              fontSize: 14,
                              height: 1.5,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _slides.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == index ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? const Color(0xFF10B981)
                          : Colors.white.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: GlassButton(
                  text: _currentPage == _slides.length - 1 ? 'Get Started' : 'Next',
                  onPressed: () {
                    if (_currentPage == _slides.length - 1) {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                    } else {
                      _controller.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeIn,
                      );
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
