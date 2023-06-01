# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
name = "Hôtel Martinez - The Unbound Collection by Hvatt"
address = "73 Bd de la Croisette, 06400 Cannes"
Location.create(name:, address:)

name = "Exclusive Hotel Belle Plage"
address = "2 Rue Brougham, 06400 Cannes"
Location.create(name:, address:)

name = "Best Western Premier Le Patio des Artistes - Cannes"
address = "6 Rue de Bône, 06400 Cannes"
Location.create(name:, address:)

name = "Le Negresco"
address = "37 Prom. des Anglais, 06000 Nice"
Location.create(name:, address:)

name = "Caesars Palace"
address = "3570 S Las Vegas Blvd, Las Vegas, NV 89109, United States"
Location.create(name:, address:)
