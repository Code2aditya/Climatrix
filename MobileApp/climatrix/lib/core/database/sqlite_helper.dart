import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class SQLiteHelper {
  static Database? _database;

  static Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB();
    return _database!;
  }

  static Future<Database> _initDB() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'climatrix_offline.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        // Pending tree registrations created offline
        await db.execute('''
          CREATE TABLE pending_trees (
            local_id TEXT PRIMARY KEY,
            species_id TEXT NOT NULL,
            species_name TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            initial_height_cm REAL NOT NULL,
            photo_url TEXT,
            notes TEXT,
            created_at TEXT NOT NULL,
            sync_status TEXT NOT NULL DEFAULT 'PENDING'
          )
        ''');

        // Pending health inspections created offline
        await db.execute('''
          CREATE TABLE pending_inspections (
            local_id TEXT PRIMARY KEY,
            planted_tree_id TEXT NOT NULL,
            tree_tag TEXT NOT NULL,
            milestone TEXT NOT NULL,
            height_cm REAL NOT NULL,
            health_rating INTEGER NOT NULL,
            soil_moisture TEXT NOT NULL,
            photo_url TEXT,
            gps_lat REAL NOT NULL,
            gps_lng REAL NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL,
            sync_status TEXT NOT NULL DEFAULT 'PENDING'
          )
        ''');
      },
    );
  }

  static Future<void> insertPendingTree(Map<String, dynamic> row) async {
    final db = await database;
    await db.insert('pending_trees', row, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  static Future<List<Map<String, dynamic>>> getPendingTrees() async {
    final db = await database;
    return await db.query('pending_trees', where: "sync_status = 'PENDING'");
  }

  static Future<void> removePendingTree(String localId) async {
    final db = await database;
    await db.delete('pending_trees', where: 'local_id = ?', whereArgs: [localId]);
  }

  static Future<void> insertPendingInspection(Map<String, dynamic> row) async {
    final db = await database;
    await db.insert('pending_inspections', row, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  static Future<List<Map<String, dynamic>>> getPendingInspections() async {
    final db = await database;
    return await db.query('pending_inspections', where: "sync_status = 'PENDING'");
  }

  static Future<void> removePendingInspection(String localId) async {
    final db = await database;
    await db.delete('pending_inspections', where: 'local_id = ?', whereArgs: [localId]);
  }

  static Future<int> getPendingCount() async {
    final db = await database;
    final trees = await db.query('pending_trees', where: "sync_status = 'PENDING'");
    final inspections = await db.query('pending_inspections', where: "sync_status = 'PENDING'");
    return trees.length + inspections.length;
  }
}
