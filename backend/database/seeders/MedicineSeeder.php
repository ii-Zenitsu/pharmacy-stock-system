<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MedicineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = [
            'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Cetirizine', 'Omeprazole', 'Metformin', 'Amlodipine', 'Simvastatin', 'Levothyroxine', 'Lisinopril', 'Atorvastatin', 'Sertraline', 'Fluoxetine', 'Gabapentin', 'Montelukast',
            'Ciprofloxacin', 'Azithromycin', 'Clonazepam', 'Lorazepam', 'Hydrochlorothiazide', 'Furosemide', 'Albuterol', 'Prednisone', 'Warfarin', 'Clopidogrel', 'Rivaroxaban', 'Duloxetine', 'Venlafaxine', 'Escitalopram', 'Bupropion',
            'Trazodone', 'Mirtazapine', 'Amitriptyline', 'Citalopram', 'Propranolol', 'Carvedilol', 'Metoprolol', 'Bisoprolol', 'Diltiazem', 'Verapamil', 'Nitroglycerin', 'Aspirin', 'Diphenhydramine', 'Loratadine', 'Ranitidine', 'Famotidine',
            'Esomeprazole', 'Pantoprazole', 'Rabeprazole', 'Lansoprazole', 'Cimetidine', 'Sucralfate', 'Bismuth Subsalicylate', 'Prochlorperazine', 'Ondansetron', 'Metoclopramide', 'Promethazine', 'Hydroxyzine', 'Dexamethasone', 'Betamethasone',
            'Triamcinolone', 'Fluticasone', 'Budesonide', 'Mometasone', 'Beclomethasone', 'Ciclesonide', 'Flunisolide', 'Desloratadine', 'Levocetirizine', 'Fexofenadine', 'Chlorpheniramine', 'Dexchlorpheniramine', 'Brompheniramine',
            'Dextromethorphan', 'Guaifenesin', 'Codeine', 'Promethazine with Codeine', 'Phenylephrine', 'Pseudoephedrine', 'Oxymetazoline', 'Xylometazoline', 'Fluticasone Nasal Spray', 'Mometasone Nasal Spray', 'Budesonide Nasal Spray',
            'Beclomethasone Nasal Spray', 'Fluticasone Propionate', 'Mometasone Furoate', 'Triamcinolone Acetonide'
        ];

        $imageCount = 14;

        foreach ($names as $index => $name) {
            $imageNumber = ($index % $imageCount) + 1;
            $imagePath = 'images/medicines/med-' . $imageNumber . '.jpg';

            Medicine::factory()->create([
                'name' => $name,
                'image' => $imagePath,
            ]);
        }
    }
}