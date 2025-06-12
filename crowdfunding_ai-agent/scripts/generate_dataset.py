import csv
import random
import os

print("🚀 Starting Dataset Generation...")

# --- Word Banks for Realistic Variety ---

# Genuine Campaign Components
genuine_actions = ["Help us fund", "Support our project to", "We are raising money for", "Join our campaign to", "Contribute to our mission to", "Help us build", "Fund our initiative to"]
medical_needs = ["life-saving surgery", "cancer treatment", "a new prosthetic limb", "essential medical supplies", "leukemia therapy", "a heart transplant", "urgent medical care"]
community_projects = ["a new community playground", "the local library renovation", "a community garden", "a new skate park", "a free coding bootcamp", "a local youth center"]
education_goals = ["scholarships for underprivileged students", "laptops for our rural school", "new science lab equipment", "books for the town library", "a free financial literacy workshop"]
animal_causes = ["our local animal shelter", "medical care for injured stray animals", "a sanctuary for rescued farm animals", "a conservation project for endangered sea turtles"]
tech_creative_products = ["our innovative new smart gadget", "our independent documentary film", "the publishing of my first novel", "our debut music album", "a new mobile app for mental health"]
disaster_relief = ["families affected by the recent floods", "rebuilding homes after the hurricane", "providing essentials after the earthquake", "supporting firefighters during the wildfires"]

# Non-Genuine Campaign Components
frivolous_wants = ["my dream vacation to Bali", "a new luxury sports car", "my personal collection of designer shoes", "a brand new 8K TV", "my world tour"]
bad_actions = ["Fund my", "Help me buy", "I need money for", "Support my quest to"]
against_policy_items = ["a weekend beer party", "my gambling trip to Vegas", "a new collection of vape pens", "an all-night rave", "a box of expensive cigars"]
absurd_goals = ["build a giant statue of my cat", "prove the earth is flat", "teach squirrels to sing opera", "find the lost city of Atlantis", "make pineapple on pizza illegal"]
vague_reasons = ["personal reasons", "an urgent unspecified need", "a secret project", "my financial goals", "a private matter"]

# Placeholders
names = ["John", "Maria", "Ahmed", "Chen", "Emily", "David", "Fatima"]
family_members = ["father", "mother", "sister", "brother", "daughter", "son", "aunt"]
locations = ["Northwood", "Springfield", "Oak Creek", "the coastal region", "our city", "the local community"]


# --- Generation Logic ---

def generate_row():
    """Generates a single row (description, is_genuine)"""
    if random.random() > 0.5:
        # Generate a GENUINE campaign (label 1)
        label = 1
        category = random.choice(['medical', 'community', 'education', 'animals', 'tech_creative', 'disaster'])
        
        if category == 'medical':
            desc = f"{random.choice(genuine_actions)} {random.choice(medical_needs)} for my {random.choice(family_members)}, {random.choice(names)}."
        elif category == 'community':
            desc = f"{random.choice(genuine_actions)} {random.choice(community_projects)} in {random.choice(locations)}."
        elif category == 'education':
            desc = f"{random.choice(genuine_actions)} {random.choice(education_goals)}."
        elif category == 'animals':
            desc = f"{random.choice(genuine_actions)} {random.choice(animal_causes)}."
        elif category == 'tech_creative':
            desc = f"{random.choice(genuine_actions)} {random.choice(tech_creative_products)}."
        else: # disaster
            desc = f"Urgent disaster relief for {random.choice(disaster_relief)}."

    else:
        # Generate a NON-GENUINE campaign (label 0)
        label = 0
        category = random.choice(['frivolous', 'policy_violation', 'absurd', 'vague'])

        if category == 'frivolous':
            desc = f"{random.choice(bad_actions)} {random.choice(frivolous_wants)}."
        elif category == 'policy_violation':
            desc = f"Raising money for {random.choice(against_policy_items)}."
        elif category == 'absurd':
            desc = f"{random.choice(bad_actions)} {random.choice(absurd_goals)}."
        else: # vague
            desc = f"I am seeking donations for {random.choice(vague_reasons)}."
            
    return desc, label

# --- Main Script Execution ---

NUM_ROWS = 20000
FILENAME = 'generated_dataset_20k.csv'
dataset = []

for i in range(NUM_ROWS):
    if (i + 1) % 1000 == 0:
        print(f"   - Generating row {i+1}/{NUM_ROWS}...")
    dataset.append(generate_row())

# Shuffle the dataset to mix genuine and non-genuine entries
random.shuffle(dataset)

# Write to CSV
try:
    with open(FILENAME, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['description', 'is_genuine']) # Write header
        writer.writerows(dataset)
    print(f"\n✅ Successfully generated '{FILENAME}' with {NUM_ROWS} rows.")
    print("Please rename this file to 'dataset.csv' and move it to your 'data/' folder.")
except Exception as e:
    print(f"\n❌ An error occurred: {e}")