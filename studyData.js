window.studyData = {
    conditions: [
        {
            title: "Asthma",
            description: "A chronic inflammatory disease of the airways that causes reversible bronchospasm and excessive mucus production.",
            points: [
                "Signs & Symptoms: Wheezing on exhalation, prolonged exhalation phase, tripod positioning, accessory muscle use.",
                "Pathophysiology: Air gets trapped in the alveoli because the bronchioles constrict on exhalation.",
                "Treatment: Albuterol (MDI or Nebulizer) to dilate the bronchioles, high-flow oxygen, CPAP for severe cases."
            ]
        },
        {
            title: "Chronic Obstructive Pulmonary Disease (COPD)",
            description: "A group of lung diseases (Emphysema & Chronic Bronchitis) that block airflow and make it difficult to breathe.",
            points: [
                "Emphysema (Pink Puffer): Destruction of alveolar walls causing loss of elasticity. Barrel chest presentation.",
                "Chronic Bronchitis (Blue Bloater): Continuous inflammation and excessive mucus. Productive cough for months.",
                "Treatment: High-flow O2, Albuterol, CPAP. Caution with hypoxic drive (though O2 is never withheld in distress)."
            ]
        },
        {
            title: "Congestive Heart Failure (CHF)",
            description: "A condition where the heart doesn't pump blood as well as it should, causing fluid to back up.",
            points: [
                "Left-Sided Failure: Fluid backs up into the Lungs. Causes pulmonary edema, crackles/rales, pink frothy sputum, orthopnea.",
                "Right-Sided Failure: Fluid backs up into the Body. Causes Jugular Vein Distention (JVD), pedal edema (swollen feet).",
                "Treatment: CPAP to force fluid out of alveoli, Nitroglycerin to reduce preload, upright positioning."
            ]
        },
        {
            title: "Acute Myocardial Infarction (AMI)",
            description: "A heart attack. Death of heart muscle tissue due to a complete blockage of a coronary artery.",
            points: [
                "Signs & Symptoms: Crushing/squeezing chest pain radiating to jaw/left arm, diaphoresis, nausea, impending doom.",
                "Differences: Unlike Angina, AMI pain does not resolve with rest and lasts longer than 15 minutes.",
                "Treatment: Aspirin (to prevent clot from growing), Nitroglycerin (to dilate vessels), rapid transport to a STEMI center."
            ]
        },
        {
            title: "Shock (Hypoperfusion)",
            description: "A state of profound collapse of the cardiovascular system leading to inadequate tissue oxygenation.",
            points: [
                "Cardiogenic: Pump failure (e.g., AMI, CHF).",
                "Hypovolemic: Fluid loss (e.g., Hemorrhage, burns, severe dehydration).",
                "Distributive: Pipe failure/vasodilation (e.g., Anaphylaxis, Sepsis, Neurogenic).",
                "Obstructive: Physical block (e.g., Tension Pneumothorax, Cardiac Tamponade)."
            ]
        }
    ],
    abbreviations: [
        {
            title: "SAMPLE",
            description: "Used for obtaining a patient's medical history.",
            points: [
                "S - Signs and Symptoms",
                "A - Allergies",
                "M - Medications",
                "P - Past Medical History",
                "L - Last oral intake",
                "E - Events leading up to the incident"
            ]
        },
        {
            title: "OPQRST",
            description: "Used specifically to assess a patient's pain or chief complaint.",
            points: [
                "O - Onset (What were you doing when it started?)",
                "P - Provocation/Palliation (Does anything make it better or worse?)",
                "Q - Quality (Can you describe the pain? Sharp, dull, crushing?)",
                "R - Region/Radiation (Where is it? Does it move anywhere?)",
                "S - Severity (On a scale of 1-10?)",
                "T - Time (Exactly when did it start?)"
            ]
        },
        {
            title: "DCAP-BTLS",
            description: "Used during the rapid trauma assessment to look for injuries.",
            points: [
                "D - Deformities",
                "C - Contusions (Bruises)",
                "A - Abrasions (Scrapes)",
                "P - Punctures/Penetrations",
                "B - Burns",
                "T - Tenderness",
                "L - Lacerations",
                "S - Swelling"
            ]
        },
        {
            title: "SLUDGEM",
            description: "Signs and symptoms of nerve agent or organophosphate poisoning (Cholinergic crisis).",
            points: [
                "S - Salivation",
                "L - Lacrimation (Tearing)",
                "U - Urination",
                "D - Defecation",
                "G - GI Upset",
                "E - Emesis (Vomiting)",
                "M - Miosis (Pinpoint pupils) / Muscle Twitching"
            ]
        },
        {
            title: "AVPU",
            description: "Used to assess a patient's level of consciousness.",
            points: [
                "A - Alert (Eyes open spontaneously)",
                "V - Verbal (Responds to your voice)",
                "P - Pain (Responds only to a painful stimulus like a sternal rub)",
                "U - Unresponsive (No response to any stimulus)"
            ]
        }
    ],
    terms: [
        {
            title: "Ischemia vs. Infarction",
            description: "Understanding tissue damage.",
            points: [
                "Ischemia: A lack of oxygen to tissue that causes pain but is completely reversible if blood flow is restored (e.g., Angina).",
                "Infarction: Actual death of the tissue. This damage is permanent (e.g., Myocardial Infarction)."
            ]
        },
        {
            title: "Agonist vs. Antagonist",
            description: "How drugs interact with cellular receptors.",
            points: [
                "Agonist: A medication that causes stimulation of receptors (e.g., Albuterol stimulates Beta-2 receptors to open lungs).",
                "Antagonist: A medication that binds to a receptor and blocks other medications or chemicals from attaching (e.g., Naloxone blocks opioids)."
            ]
        },
        {
            title: "Respiration vs. Ventilation",
            description: "The mechanics of breathing.",
            points: [
                "Ventilation: The physical, mechanical act of moving air into and out of the lungs.",
                "Respiration: The actual exchange of oxygen and carbon dioxide across the cellular membrane in the alveoli."
            ]
        },
        {
            title: "Preload vs. Afterload",
            description: "Cardiac hemodynamics.",
            points: [
                "Preload: The amount of blood returning to the heart (stretching the ventricles) before it beats.",
                "Afterload: The resistance (pressure) the heart must pump against to eject blood into the body. High blood pressure = High afterload."
            ]
        }
    ],
    facts: [
        {
            title: "The Rule of Nines",
            description: "Standardized method for estimating the percentage of Body Surface Area (BSA) burned.",
            points: [
                "Adult Head: 9%",
                "Adult Anterior Torso: 18% (Chest 9%, Abdomen 9%)",
                "Adult Posterior Torso: 18%",
                "Adult Each Arm: 9% (4.5% front, 4.5% back)",
                "Adult Each Leg: 18% (9% front, 9% back)",
                "Adult Groin: 1%",
                "Pediatric Difference: The head is much larger (18%) and the legs are smaller (14% each)."
            ]
        },
        {
            title: "CPR & Resuscitation Ratios",
            description: "AHA 2020 Guidelines for compressions and ventilations.",
            points: [
                "Adult (1 or 2 Rescuers): 30:2 ratio.",
                "Child/Infant (1 Rescuer): 30:2 ratio.",
                "Child/Infant (2 Rescuers): 15:2 ratio.",
                "Neonatal (HR < 60): 3:1 ratio (90 compressions, 30 breaths per minute).",
                "Compression Rate: 100-120 compressions per minute for all ages.",
                "Compression Depth: Adult (At least 2 inches), Child (About 2 inches), Infant (1.5 inches)."
            ]
        },
        {
            title: "Normal Vital Signs by Age",
            description: "Pediatric vitals run much faster than adult vitals.",
            points: [
                "Adult: HR (60-100), RR (12-20), Systolic BP (90-140).",
                "School-Age (6-12 yrs): HR (70-120), RR (18-30).",
                "Preschool (3-5 yrs): HR (80-140), RR (22-34).",
                "Toddler (1-3 yrs): HR (90-150), RR (24-40).",
                "Infant (1-12 mo): HR (100-160), RR (30-60).",
                "Neonate (0-1 mo): HR (100-180)."
            ]
        },
        {
            title: "Specific Contraindications",
            description: "Critical 'gotchas' that will fail you on the NREMT.",
            points: [
                "Nitroglycerin: Systolic BP < 100, head injury, took Erectile Dysfunction meds (Viagra, Cialis) within 24-48 hours.",
                "Aspirin: Allergy to NSAIDs, history of GI bleeding, asthma induced by aspirin.",
                "Traction Splint: Pelvic fracture, knee injury, lower leg/ankle injury, partial amputation.",
                "NPA: Severe facial/head trauma with suspected basilar skull fracture.",
                "CPAP: Unconscious, apneic, vomiting, or suspected pneumothorax."
            ]
        }
    ],
    pharmacology: [
        {
            title: "Oxygen",
            description: "Used for hypoxia, hypoperfusion, and respiratory distress.",
            points: [
                "Indications: Hypoxia, respiratory distress, shock, SpO2 < 94%.",
                "Contraindications: None in emergency situations, but use caution in COPD (though never withhold if in distress). Withhold in stroke/ACS if SpO2 > 94%.",
                "Dose: 1-6 LPM (Nasal Cannula), 10-15 LPM (Non-Rebreather), 15 LPM (BVM)."
            ]
        },
        {
            title: "Epinephrine (Adrenaline)",
            description: "Used for severe allergic reactions (Anaphylaxis).",
            points: [
                "Indications: Anaphylaxis (severe allergic reaction with respiratory distress or shock).",
                "Contraindications: None in a life-threatening emergency.",
                "Action: Alpha 1 (Vasoconstriction), Beta 1 (Increased HR), Beta 2 (Bronchodilation).",
                "Dose: 0.3 mg (Adult IM), 0.15 mg (Pediatric IM)."
            ]
        },
        {
            title: "Nitroglycerin (NTG)",
            description: "Used for chest pain of cardiac origin (Angina/AMI).",
            points: [
                "Indications: Chest pain of cardiac origin.",
                "Contraindications: Systolic BP < 100 mmHg, head injury, use of erectile dysfunction medications (PDE5 inhibitors like Viagra, Cialis) within 24-48 hours.",
                "Action: Systemic vasodilation (decreases preload and afterload), dilates coronary arteries.",
                "Dose: 0.4 mg sublingual (tablet or spray). Max 3 doses, 5 minutes apart."
            ]
        },
        {
            title: "Aspirin (ASA)",
            description: "Used for suspected Acute Coronary Syndrome (ACS).",
            points: [
                "Indications: Suspected cardiac chest pain/discomfort.",
                "Contraindications: True allergy to NSAIDs, active GI bleeding, recent trauma.",
                "Action: Prevents platelets from aggregating (clumping together), stopping clots from growing.",
                "Dose: 162-324 mg (chewable tablets)."
            ]
        },
        {
            title: "Albuterol",
            description: "Used for bronchospasm (Asthma, COPD).",
            points: [
                "Indications: Wheezing, bronchospasm, asthma, COPD exacerbation.",
                "Contraindications: Hypersensitivity, tachycardia (relative contraindication).",
                "Action: Beta-2 agonist (relaxes bronchial smooth muscle causing bronchodilation).",
                "Dose: 2.5 mg in 3 mL normal saline via nebulizer."
            ]
        },
        {
            title: "Oral Glucose",
            description: "Used for conscious patients with hypoglycemia.",
            points: [
                "Indications: Altered mental status with a known history of diabetes and suspected hypoglycemia.",
                "Contraindications: Unconscious, inability to swallow, absent gag reflex.",
                "Action: Increases circulating blood glucose levels.",
                "Dose: 15-25 grams (usually one tube) applied to the buccal mucosa (between cheek and gum)."
            ]
        }
    ],
    assessment: [
        {
            title: "1. Scene Size-Up",
            description: "The very first step upon arriving at any incident.",
            points: [
                "Ensure BSI (Body Substance Isolation) and Scene Safety.",
                "Determine the Mechanism of Injury (MOI) or Nature of Illness (NOI).",
                "Determine the number of patients.",
                "Request additional EMS assistance or specialized resources if necessary.",
                "Consider stabilization of the spine (C-spine)."
            ]
        },
        {
            title: "2. Primary Assessment",
            description: "Designed to identify and treat immediate life threats.",
            points: [
                "Form a general impression of the patient (Age, sex, position, apparent distress).",
                "Determine Level of Consciousness (AVPU).",
                "Determine Chief Complaint / Apparent Life Threats.",
                "Assess Airway and Breathing (Open airway, ensure adequate ventilation, provide O2).",
                "Assess Circulation (Assess pulse, assess skin CTC, control major bleeding).",
                "Determine Patient Priority and make a transport decision."
            ]
        },
        {
            title: "3. History Taking",
            description: "Gathering information about the patient's past and current medical status.",
            points: [
                "Obtain a baseline set of vital signs (BP, Pulse, RR, SpO2).",
                "Investigate the Chief Complaint using OPQRST.",
                "Obtain a past medical history using SAMPLE."
            ]
        },
        {
            title: "4. Secondary Assessment",
            description: "A systematic physical examination.",
            points: [
                "Medical Patient: Focused assessment based on the specific body system involved (e.g., respiratory, cardiovascular).",
                "Trauma Patient: Rapid Trauma Assessment (Head-to-Toe) looking for DCAP-BTLS, or a focused exam on the isolated injury."
            ]
        },
        {
            title: "5. Reassessment",
            description: "Continuous monitoring while en route to the hospital.",
            points: [
                "Repeat the Primary Assessment.",
                "Reassess vital signs.",
                "Check interventions (are the oxygen, splints, or bleeding control still effective?).",
                "Stable patients: Reassess every 15 minutes.",
                "Unstable patients: Reassess every 5 minutes."
            ]
        }
    ],
    triage: [
        {
            title: "START Triage Overview",
            description: "Simple Triage and Rapid Treatment (START) is used for adults in Mass Casualty Incidents (MCIs).",
            points: [
                "The goal is to sort patients quickly to do the greatest good for the greatest number.",
                "You have 30-60 seconds per patient.",
                "The ONLY treatments allowed during triage are: Opening an airway and controlling severe bleeding."
            ]
        },
        {
            title: "GREEN (Minor / Walking Wounded)",
            description: "Patients who are able to follow commands and walk.",
            points: [
                "Action: Command all patients who can walk to move to a designated area.",
                "Status: They are classified as GREEN. They will be assessed later."
            ]
        },
        {
            title: "BLACK (Deceased / Expectant)",
            description: "Patients who are apneic after simple airway maneuvers.",
            points: [
                "Action: Check breathing. If none, open the airway.",
                "Status: If they STILL do not breathe after opening the airway, tag them BLACK and move on. No CPR is performed in an MCI."
            ]
        },
        {
            title: "RED (Immediate)",
            description: "Patients with critical, life-threatening injuries who can be saved with rapid intervention. Checked via RPM.",
            points: [
                "Respirations (R): If respirations are > 30 breaths per minute, tag RED.",
                "Perfusion (P): If radial pulse is absent or capillary refill is > 2 seconds, tag RED.",
                "Mental Status (M): If they cannot follow simple commands, tag RED."
            ]
        },
        {
            title: "YELLOW (Delayed)",
            description: "Patients with serious but not immediately life-threatening injuries.",
            points: [
                "If they fail the GREEN test (cannot walk) but PASS all the RED tests (Respirations < 30, Perfusion normal, Mental Status follows commands), tag them YELLOW."
            ]
        }
    ],
    airway: [
        {
            title: "Oropharyngeal Airway (OPA)",
            description: "Used to keep the tongue from blocking the airway in unconscious patients.",
            points: [
                "Indications: Unresponsive patient without a gag reflex.",
                "Contraindications: Conscious patients, any patient with an intact gag reflex.",
                "Measurement: Measure from the corner of the mouth to the earlobe (or angle of the jaw).",
                "Insertion: Insert upside down (pointing towards roof of mouth), advance until resistance is met, then rotate 180 degrees."
            ]
        },
        {
            title: "Nasopharyngeal Airway (NPA)",
            description: "A soft tube inserted into the nose to provide an open airway.",
            points: [
                "Indications: Unresponsive or altered mental status patients with an intact gag reflex.",
                "Contraindications: Severe head injury with blood draining from the nose, suspected basilar skull fracture.",
                "Measurement: Measure from the tip of the nose to the earlobe.",
                "Insertion: Lubricate with a water-soluble lubricant. Insert with the bevel facing the septum."
            ]
        },
        {
            title: "Oxygen Delivery Devices",
            description: "Choosing the right tool for the right patient condition.",
            points: [
                "Nasal Cannula: 1-6 LPM. Delivers 24-44% oxygen. Used for mild hypoxia or patients who cannot tolerate a mask.",
                "Non-Rebreather Mask (NRB): 10-15 LPM. Delivers up to 90% oxygen. Used for significant hypoxia, shock, and severe distress in spontaneously breathing patients.",
                "Bag-Valve Mask (BVM): 15 LPM. Delivers nearly 100% oxygen. Used ONLY for patients who are apneic (not breathing) or breathing too slowly/shallowly to survive.",
                "CPAP: Continuous Positive Airway Pressure. Used for awake, breathing patients with severe pulmonary edema (CHF) or COPD to push fluid out of alveoli."
            ]
        }
    ],
    terminology: [
        {
            title: "Root Words: Organs",
            description: "Prefixes referring to specific body systems.",
            points: [
                "Cardio-: Heart (e.g., Tachycardia = Fast heart).",
                "Neuro-: Nerve/Brain (e.g., Neuropathy = Nerve disease).",
                "Pneumo- / Pulmo-: Lungs (e.g., Pneumothorax = Air in the chest).",
                "Hepat-: Liver (e.g., Hepatitis = Inflammation of the liver).",
                "Nephro-: Kidney (e.g., Nephritis = Inflammation of the kidney).",
                "Gastro-: Stomach (e.g., Gastroenteritis)."
            ]
        },
        {
            title: "Prefixes: Speeds and Levels",
            description: "Words that describe how fast, high, or low something is.",
            points: [
                "Tachy-: Fast (e.g., Tachypnea = Fast breathing).",
                "Brady-: Slow (e.g., Bradycardia = Slow heart rate).",
                "Hyper-: High, excessive, above normal (e.g., Hypertension = High blood pressure).",
                "Hypo-: Low, deficient, below normal (e.g., Hypoxia = Low oxygen).",
                "Dys-: Painful, difficult, or abnormal (e.g., Dyspnea = Difficulty breathing)."
            ]
        },
        {
            title: "Suffixes: Conditions",
            description: "The endings of medical words that tell you what is happening to the organ.",
            points: [
                "-itis: Inflammation (e.g., Appendicitis = Inflammation of the appendix).",
                "-emia: Blood condition (e.g., Hypoglycemia = Low sugar in the blood).",
                "-pnea: Breathing (e.g., Apnea = Absence of breathing).",
                "-uria: Condition of the urine (e.g., Hematuria = Blood in the urine)."
            ]
        }
    ],
    pediatrics: [
        {
            title: "The Pediatric Assessment Triangle (PAT)",
            description: "A rapid, visual assessment tool used 'from the doorway' before touching the child.",
            points: [
                "Appearance: Is the child interacting? Are they floppy? Do they track you with their eyes?",
                "Work of Breathing: Are they using accessory muscles? Nasal flaring? Grunting? Tripod position?",
                "Circulation to Skin: Is the skin pale, cyanotic (blue), or mottled (blotchy)?",
                "Action: If all three are abnormal, the child is 'Sick' and requires immediate, rapid intervention and transport."
            ]
        },
        {
            title: "APGAR Score",
            description: "Used to evaluate a newborn exactly 1 minute and 5 minutes after birth.",
            points: [
                "A - Appearance: 0 (Blue/Pale), 1 (Pink body, blue extremities), 2 (Completely pink).",
                "P - Pulse: 0 (Absent), 1 (Under 100 bpm), 2 (Over 100 bpm).",
                "G - Grimace: 0 (No response), 1 (Minimal response/facial grimace), 2 (Vigorous cry/pulls away).",
                "A - Activity: 0 (Limp), 1 (Some flexion of limbs), 2 (Active motion).",
                "R - Respirations: 0 (Absent), 1 (Slow, irregular), 2 (Good, strong cry).",
                "Total Score: Out of 10. 7-10 is normal. 4-6 requires stimulation and oxygen. 0-3 requires immediate resuscitation."
            ]
        },
        {
            title: "Stages of Labor",
            description: "Understanding the progression of childbirth.",
            points: [
                "First Stage (Dilation): Begins with the onset of regular contractions and ends when the cervix is fully dilated (10 cm). This is the longest stage.",
                "Second Stage (Expulsion): Begins when the baby's head enters the birth canal (crowning) and ends when the baby is completely delivered.",
                "Third Stage (Placental): Begins immediately after the baby is born and ends with the delivery of the placenta (usually within 30 minutes)."
            ]
        }
    ]
};


