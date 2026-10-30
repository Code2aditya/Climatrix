import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/glassmorphism_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/climate_provider.dart';
import 'providers/species_provider.dart';
import 'providers/tree_provider.dart';
import 'providers/language_provider.dart';
import 'views/common/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ClimatrixApp());
}

class ClimatrixApp extends StatelessWidget {
  const ClimatrixApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ClimateProvider()),
        ChangeNotifierProvider(create: (_) => SpeciesProvider()),
        ChangeNotifierProvider(create: (_) => TreeProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
      ],
      child: Consumer<LanguageProvider>(
        builder: (context, lang, child) {
          return MaterialApp(
            title: 'Climatrix - Smart Urban Heat & Climate Resilience',
            debugShowCheckedModeBanner: false,
            theme: GlassmorphismTheme.themeData,
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
