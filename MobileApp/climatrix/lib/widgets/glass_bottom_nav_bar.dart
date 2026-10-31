import 'package:flutter/material.dart';

class GlassBottomNavItem {
  final IconData icon;
  final String label;

  const GlassBottomNavItem({
    required this.icon,
    required this.label,
  });
}

class GlassBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  final List<GlassBottomNavItem> items;

  const GlassBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).padding.bottom;

    return Container(
      padding: EdgeInsets.only(
        top: 8,
        bottom: bottomInset > 0 ? bottomInset : 8,
        left: 12,
        right: 12,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFF0B101D),
        border: const Border(
          top: BorderSide(color: Color(0xFF1E293B), width: 1.5),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.6),
            blurRadius: 16,
            offset: const Offset(0, -4),
          )
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: items.asMap().entries.map((entry) {
          final idx = entry.key;
          final item = entry.value;
          final isSelected = currentIndex == idx;

          return InkWell(
            onTap: () => onTap(idx),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFF10B981).withValues(alpha: 0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: isSelected
                    ? Border.all(color: const Color(0xFF10B981), width: 1.2)
                    : null,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    item.icon,
                    color: isSelected ? const Color(0xFF10B981) : Colors.white70,
                    size: 22,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.label,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.white60,
                      fontSize: 10,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
