import 'dart:ui';
import 'package:flutter/material.dart';

class GlassmorphismTheme {
  // Brand & Palette Gradients
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color cardDarkBackground = Color(0xFF1E293B);

  static const LinearGradient spaceBackgroundGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF0B132B),
      Color(0xFF1C2541),
      Color(0xFF0B2B26),
    ],
  );

  static const LinearGradient emeraldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF059669), Color(0xFF10B981), Color(0xFF34D399)],
  );

  static const LinearGradient heatCrisisGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF991B1B), Color(0xFFDC2626), Color(0xFFF87171)],
  );

  static const LinearGradient cyberAmberGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFD97706), Color(0xFFF59E0B), Color(0xFFFBBF24)],
  );

  static const LinearGradient auroraBlueGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0284C7), Color(0xFF0EA5E9), Color(0xFF38BDF8)],
  );

  // Text Theme
  static ThemeData get themeData {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: const Color(0xFF10B981),
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF10B981),
        secondary: Color(0xFF38BDF8),
        surface: Color(0xFF1E293B),
        error: Color(0xFFEF4444),
      ),
      fontFamily: 'Roboto',
      useMaterial3: true,
    );
  }
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final double blurSigma;
  final Color? opacityColor;
  final double opacity;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final Border? border;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.borderRadius = 20.0,
    this.blurSigma = 14.0,
    this.opacityColor,
    this.opacity = 0.12,
    this.padding = const EdgeInsets.all(16.0),
    this.margin = EdgeInsets.zero,
    this.border,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveBorder = border ??
        Border.all(
          color: Colors.white.withValues(alpha: 0.2),
          width: 1.2,
        );

    final containerChild = Padding(
      padding: margin,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: opacityColor ?? Colors.white.withValues(alpha: opacity),
              borderRadius: BorderRadius.circular(borderRadius),
              border: effectiveBorder,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.25),
                  blurRadius: 16,
                  spreadRadius: 1,
                  offset: const Offset(0, 6),
                )
              ],
            ),
            child: child,
          ),
        ),
      ),
    );

    if (onTap != null) {
      return InkWell(
        borderRadius: BorderRadius.circular(borderRadius),
        onTap: onTap,
        child: containerChild,
      );
    }

    return containerChild;
  }
}

class GlassButton extends StatelessWidget {
  final String text;
  final IconData? icon;
  final VoidCallback onPressed;
  final LinearGradient gradient;
  final bool isLoading;

  const GlassButton({
    super.key,
    required this.text,
    this.icon,
    required this.onPressed,
    this.gradient = GlassmorphismTheme.emeraldGradient,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: gradient.colors.first.withValues(alpha: 0.4),
            blurRadius: 12,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: isLoading ? null : onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (isLoading) ...[
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  ),
                  const SizedBox(width: 12),
                ] else if (icon != null) ...[
                  Icon(icon, color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                ],
                Text(
                  text,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HeatStatusBadge extends StatelessWidget {
  final String status;

  const HeatStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color border;
    Color text;
    IconData icon;

    switch (status.toUpperCase()) {
      case 'CRITICAL':
        bg = const Color(0xFF7F1D1D).withValues(alpha: 0.8);
        border = const Color(0xFFEF4444);
        text = const Color(0xFFFCA5A5);
        icon = Icons.local_fire_department;
        break;
      case 'HIGH':
        bg = const Color(0xFF78350F).withValues(alpha: 0.8);
        border = const Color(0xFFF59E0B);
        text = const Color(0xFFFDE68A);
        icon = Icons.warning_amber_rounded;
        break;
      case 'MODERATE':
        bg = const Color(0xFF1E3A8A).withValues(alpha: 0.8);
        border = const Color(0xFF38BDF8);
        text = const Color(0xFFBAE6FD);
        icon = Icons.thermostat;
        break;
      case 'THRIVING':
      case 'LOW':
      default:
        bg = const Color(0xFF064E3B).withValues(alpha: 0.8);
        border = const Color(0xFF10B981);
        text = const Color(0xFFA7F3D0);
        icon = Icons.eco;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: border.withValues(alpha: 0.3),
            blurRadius: 8,
          )
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: text, size: 14),
          const SizedBox(width: 4),
          Text(
            status.toUpperCase(),
            style: TextStyle(
              color: text,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}

class MetricBadge extends StatelessWidget {
  final String label;
  final String value;
  final String? unit;
  final IconData icon;
  final Color accentColor;

  const MetricBadge({
    super.key,
    required this.label,
    required this.value,
    this.unit,
    required this.icon,
    this.accentColor = const Color(0xFF10B981),
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      borderRadius: 14,
      opacity: 0.15,
      border: Border.all(
        color: accentColor.withValues(alpha: 0.3),
        width: 1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Icon(icon, color: accentColor, size: 14),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.7),
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (unit != null) ...[
                  const SizedBox(width: 2),
                  Text(
                    unit!,
                    style: TextStyle(
                      color: accentColor,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ]
              ],
            ),
          ),
        ],
      ),
    );
  }
}
