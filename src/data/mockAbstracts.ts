import { ResearchAbstract } from '../types/abstract';

export const mockAbstracts: ResearchAbstract[] = [
  {
    id: '1',
    title: 'Neural Network Approaches to Natural Language Processing in Clinical Text Analysis',
    authors: [
      { name: 'Sarah Johnson', affiliation: 'Stanford University' },
      { name: 'Michael Chen', affiliation: 'Stanford University' },
      { name: 'Robert Williams', affiliation: 'University of California, San Francisco' }
    ],
    journal: 'Journal of Biomedical Informatics',
    year: 2023,
    doi: '10.1016/j.jbi.2023.04.015',
    abstract: 'Recent advances in natural language processing have revolutionized how clinical text is analyzed and understood by automated systems. This study presents a comprehensive review of neural network approaches to clinical text analysis with a focus on attention-based models and their applications in electronic health records. We compare the performance of BERT, RoBERTa, and domain-specific BioClinicalBERT models on various clinical NLP tasks. Our experimental results demonstrate that domain-specific pre-training significantly improves performance on specialized medical tasks, while general language models excel at capturing broader contextual relationships. These findings suggest that hybrid approaches combining domain knowledge with advanced neural architectures may offer the best path forward for clinical NLP applications.',
    keywords: ['Natural Language Processing', 'Neural Networks', 'Clinical Text', 'BERT', 'Electronic Health Records']
  },
  {
    id: '2',
    title: 'Quantum Computing Applications in Computational Chemistry: Current Status and Future Prospects',
    authors: [
      { name: 'David Martinez', affiliation: 'MIT' },
      { name: 'Lisa Quantum', affiliation: 'IBM Research' }
    ],
    journal: 'Nature Quantum Information',
    year: 2024,
    doi: '10.1038/s41534-024-00721-7',
    abstract: 'Quantum computing presents a promising approach to solving complex computational chemistry problems that remain intractable for classical computers. This paper surveys recent developments in quantum algorithms for electronic structure calculations, focusing on variational quantum eigensolvers (VQE) and quantum phase estimation (QPE) techniques. We analyze the performance of these algorithms on current NISQ (Noisy Intermediate-Scale Quantum) devices for calculating ground state energies of small molecules. Results indicate that while error mitigation techniques have improved accuracy, significant challenges remain in scalability and error rates. We propose a roadmap for near-term applications and identify key milestones required for quantum advantage in computational chemistry.',
    keywords: ['Quantum Computing', 'Computational Chemistry', 'VQE', 'Quantum Algorithms', 'NISQ']
  },
  {
    id: '3',
    title: 'Climate Change Impact on Biodiversity: A Meta-Analysis of Global Ecosystems',
    authors: [
      { name: 'Emma Rodriguez', affiliation: 'University of Oxford' },
      { name: 'Thomas Park', affiliation: 'ETH Zurich' },
      { name: 'Aisha Mahmoud', affiliation: 'University of Cape Town' }
    ],
    journal: 'Science Advances',
    year: 2023,
    doi: '10.1126/sciadv.2023456',
    abstract: 'Understanding the effects of climate change on biodiversity is critical for developing effective conservation strategies. This meta-analysis integrates data from 742 studies across six continents to quantify how climate change has affected species distribution, phenology, and population dynamics over the past five decades. Our results reveal a global mean poleward shift in species ranges of 6.1 km per decade, with significant variations across taxa and biomes. Phenological shifts averaged 2.8 days earlier per decade for spring events. Tropical ecosystems show greater vulnerability to climate disruptions despite experiencing smaller absolute temperature changes. We identify critical thresholds beyond which ecosystem resilience may be compromised and highlight regions of particular concern for conservation prioritization.',
    keywords: ['Climate Change', 'Biodiversity', 'Meta-Analysis', 'Conservation', 'Ecosystem Resilience']
  },
  {
    id: '4',
    title: 'Neuroplasticity Mechanisms in Motor Skill Acquisition: Implications for Rehabilitation',
    authors: [
      { name: 'James Lee', affiliation: 'Johns Hopkins University' },
      { name: 'Maria Gonzalez', affiliation: 'Northwestern University' }
    ],
    journal: 'Neuroscience & Biobehavioral Reviews',
    year: 2024,
    doi: '10.1016/j.neubiorev.2023.12.003',
    abstract: 'This review examines the neuroplastic mechanisms underlying motor skill acquisition and their implications for rehabilitation practices. We analyze evidence from both animal models and human studies using advanced neuroimaging techniques to track structural and functional brain changes during skill learning. Results indicate distinct phases of motor learning characterized by different neural patterns: early rapid improvements associated with prefrontal and premotor recruitment, followed by consolidation involving primary motor cortex and subcortical structures. Our findings suggest that rehabilitation protocols structured to target specific neuroplastic mechanisms at appropriate time points can maximize recovery. We propose a framework for "neuroplasticity-informed rehabilitation" that optimizes practice scheduling, feedback, and environmental enrichment based on underlying neural processes.',
    keywords: ['Neuroplasticity', 'Motor Learning', 'Rehabilitation', 'Neural Adaptation', 'Skill Acquisition']
  },
  {
    id: '5',
    title: 'Advances in mRNA Vaccine Technology: Lessons from COVID-19',
    authors: [
      { name: 'Sophia Kim', affiliation: 'Harvard Medical School' },
      { name: 'John Rivera', affiliation: 'National Institutes of Health' },
      { name: 'Rachel Chen', affiliation: 'BioNTech' }
    ],
    journal: 'Nature Reviews Immunology',
    year: 2023,
    doi: '10.1038/s41577-023-00809-5',
    abstract: 'The rapid development and deployment of mRNA vaccines against SARS-CoV-2 marked a milestone in vaccinology. This review analyzes the technological innovations that enabled this breakthrough and examines how these platforms can be adapted for other infectious diseases and therapeutic applications. We discuss advances in lipid nanoparticle formulations, nucleoside modifications to reduce immunogenicity, and optimization of the coding sequence for improved protein expression. Clinical data from COVID-19 vaccination campaigns provides unprecedented insight into mRNA vaccine safety and efficacy across diverse populations. Looking forward, we highlight promising applications in cancer immunotherapy, autoimmune disease modulation, and protein replacement therapies. Challenges in cold-chain requirements, production scalability, and global access are addressed with proposed technological solutions.',
    keywords: ['mRNA Vaccines', 'COVID-19', 'Immunology', 'Lipid Nanoparticles', 'Therapeutic Applications']
  }
];