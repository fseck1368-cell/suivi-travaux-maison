require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Projet = require('../models/Projet');
const Phase = require('../models/Phase');
const Tache = require('../models/Tache');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connecté pour le seeding...');

  await User.deleteMany({});
  await Projet.deleteMany({});
  await Phase.deleteMany({});
  await Tache.deleteMany({});

  const maitreOuvrage = await User.create({
    nom: 'Diallo', prenom: 'Mamadou', email: 'mamadou@test.com',
    password: 'password123', telephone: '771234567', role: 'maitre-ouvrage'
  });

  const maitreOeuvre = await User.create({
    nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou@test.com',
    password: 'password123', telephone: '772345678', role: 'maitre-oeuvre'
  });

  const artisan1 = await User.create({
    nom: 'Sow', prenom: 'Ibrahima', email: 'ibrahima@test.com',
    password: 'password123', telephone: '773456789', role: 'artisan',
    specialite: 'Maçonnerie'
  });

  const artisan2 = await User.create({
    nom: 'Ba', prenom: 'Ousmane', email: 'ousmane@test.com',
    password: 'password123', telephone: '774567890', role: 'artisan',
    specialite: 'Plomberie'
  });

  const projet = await Projet.create({
    titre: 'Construction Villa Almadies',
    description: 'Villa R+1 avec piscine et jardin',
    adresse: 'Almadies, Dakar',
    dateDebut: new Date('2025-01-15'),
    dateFinPrevue: new Date('2025-08-30'),
    budgetTotal: 75000000,
    statut: 'en_cours',
    maitreOuvrage: maitreOuvrage._id,
    maitreOeuvre: maitreOeuvre._id,
    avancementGlobal: 35
  });

  const phase1 = await Phase.create({
    titre: 'Fondations', projet: projet._id, ordre: 1,
    dateDebut: new Date('2025-01-15'), dateFin: new Date('2025-02-28'),
    budgetPrevu: 15000000, statut: 'terminee', avancement: 100
  });

  const phase2 = await Phase.create({
    titre: 'Maçonnerie', projet: projet._id, ordre: 2,
    dateDebut: new Date('2025-03-01'), dateFin: new Date('2025-05-15'),
    budgetPrevu: 25000000, statut: 'en_cours', avancement: 60
  });

  const phase3 = await Phase.create({
    titre: 'Toiture', projet: projet._id, ordre: 3,
    dateDebut: new Date('2025-05-16'), dateFin: new Date('2025-06-30'),
    budgetPrevu: 10000000, statut: 'a_faire', avancement: 0
  });

  const phase4 = await Phase.create({
    titre: 'Plomberie & Électricité', projet: projet._id, ordre: 4,
    dateDebut: new Date('2025-07-01'), dateFin: new Date('2025-07-31'),
    budgetPrevu: 12000000, statut: 'a_faire', avancement: 0
  });

  const phase5 = await Phase.create({
    titre: 'Finitions', projet: projet._id, ordre: 5,
    dateDebut: new Date('2025-08-01'), dateFin: new Date('2025-08-30'),
    budgetPrevu: 13000000, statut: 'a_faire', avancement: 0
  });

  await Tache.create([
    { titre: 'Terrassement', phase: phase1._id, projet: projet._id, artisan: artisan1._id, avancement: 100, statut: 'terminee', priorite: 'haute' },
    { titre: 'Coulage semelles', phase: phase1._id, projet: projet._id, artisan: artisan1._id, avancement: 100, statut: 'terminee', priorite: 'haute' },
    { titre: 'Murs RDC', phase: phase2._id, projet: projet._id, artisan: artisan1._id, avancement: 80, statut: 'en_cours', priorite: 'haute' },
    { titre: 'Murs étage', phase: phase2._id, projet: projet._id, artisan: artisan1._id, avancement: 40, statut: 'en_cours', priorite: 'moyenne' },
    { titre: 'Charpente', phase: phase3._id, projet: projet._id, artisan: artisan1._id, avancement: 0, statut: 'a_faire', priorite: 'moyenne' },
    { titre: 'Installation tuyauterie', phase: phase4._id, projet: projet._id, artisan: artisan2._id, avancement: 0, statut: 'a_faire', priorite: 'moyenne' },
    { titre: 'Peinture intérieure', phase: phase5._id, projet: projet._id, artisan: artisan1._id, avancement: 0, statut: 'a_faire', priorite: 'basse' }
  ]);

  console.log('Données de démo créées avec succès !');
  console.log('\nComptes de test :');
  console.log('  Maître d\'ouvrage : mamadou@test.com / password123');
  console.log('  Maître d\'oeuvre  : fatou@test.com / password123');
  console.log('  Artisan 1       : ibrahima@test.com / password123');
  console.log('  Artisan 2       : ousmane@test.com / password123');

  await mongoose.disconnect();
}

seed().catch(console.error);
