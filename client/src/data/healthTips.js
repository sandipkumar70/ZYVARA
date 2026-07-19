const healthTips = [
  { category: 'Hydration', tip: 'Drink at least 2-3 litres of water today.' },
  { category: 'Hydration', tip: 'Start your morning with a glass of warm water.' },
  { category: 'Hydration', tip: 'Carry a water bottle with you throughout the day.' },
  { category: 'Hydration', tip: 'Avoid sugary drinks — choose water or coconut water instead.' },
  { category: 'Hydration', tip: 'Eat water-rich fruits like watermelon and cucumber.' },

  { category: 'Nutrition', tip: 'Eat at least one bowl of fresh fruits today.' },
  { category: 'Nutrition', tip: 'Include green leafy vegetables in your meals.' },
  { category: 'Nutrition', tip: 'Avoid excessive oily and fried food.' },
  { category: 'Nutrition', tip: 'Add a handful of nuts to your daily diet.' },
  { category: 'Nutrition', tip: 'Reduce added sugar in your tea or coffee.' },
  { category: 'Nutrition', tip: 'Eat home-cooked meals more often than outside food.' },

  { category: 'Fitness', tip: 'Take a brisk 20-minute walk today.' },
  { category: 'Fitness', tip: 'Try to take the stairs instead of the lift.' },
  { category: 'Fitness', tip: 'Stretch your body for 5 minutes after waking up.' },
  { category: 'Fitness', tip: 'Avoid sitting continuously for more than an hour.' },
  { category: 'Fitness', tip: 'Do at least 15 minutes of physical activity today.' },

  { category: 'Sleep', tip: 'Sleep for 7-8 hours every night.' },
  { category: 'Sleep', tip: 'Avoid screens at least 30 minutes before bedtime.' },
  { category: 'Sleep', tip: 'Try to sleep and wake up at the same time daily.' },
  { category: 'Sleep', tip: 'Avoid heavy meals right before sleeping.' },
  { category: 'Sleep', tip: 'A dark, quiet room helps you sleep better.' },

  { category: 'Mental Health', tip: 'Take a few deep breaths whenever you feel stressed.' },
  { category: 'Mental Health', tip: 'Spend a few minutes journaling your thoughts today.' },
  { category: 'Mental Health', tip: "It's okay to say no when you're overwhelmed." },
  { category: 'Mental Health', tip: 'Talk to a friend or family member if you feel low.' },
  { category: 'Mental Health', tip: 'Take short breaks between work to avoid burnout.' },

  { category: 'Heart Health', tip: 'Reduce salt intake to keep your blood pressure healthy.' },
  { category: 'Heart Health', tip: 'Avoid smoking and limit alcohol for a healthy heart.' },
  { category: 'Heart Health', tip: 'A 30-minute walk daily supports good heart health.' },
  { category: 'Heart Health', tip: 'Include omega-3 rich foods like flax seeds and walnuts.' },
  { category: 'Heart Health', tip: 'Get your blood pressure checked regularly.' },

  { category: "Women's Health", tip: 'Track your menstrual cycle to notice any irregularities early.' },
  { category: "Women's Health", tip: 'Iron-rich foods help maintain healthy haemoglobin levels.' },
  { category: "Women's Health", tip: 'Regular health check-ups are important at every age.' },
  { category: "Women's Health", tip: 'Stay active during your period with light stretching if comfortable.' },
  { category: "Women's Health", tip: "Don't ignore persistent pain — consult a doctor if needed." },

  { category: 'General Health', tip: 'Wash your hands frequently to prevent infections.' },
  { category: 'General Health', tip: 'Do not skip your breakfast.' },
  { category: 'General Health', tip: 'Get some sunlight exposure for natural Vitamin D.' },
  { category: 'General Health', tip: 'Keep your vaccinations up to date.' },
  { category: 'General Health', tip: 'Regular health check-ups can catch problems early.' },


    { category: 'Hydration', tip: 'Drink a glass of water before every meal.' },
  { category: 'Hydration', tip: 'Increase water intake during hot weather.' },
  { category: 'Hydration', tip: 'Replace one soft drink with plain water today.' },
  { category: 'Hydration', tip: 'Drink water slowly instead of all at once.' },
  { category: 'Hydration', tip: 'Keep yourself hydrated during exercise.' },

  { category: 'Nutrition', tip: 'Choose whole grains over refined grains whenever possible.' },
  { category: 'Nutrition', tip: 'Include a source of protein in every meal.' },
  { category: 'Nutrition', tip: 'Eat colorful vegetables for a variety of nutrients.' },
  { category: 'Nutrition', tip: 'Limit packaged snacks high in salt and sugar.' },
  { category: 'Nutrition', tip: 'Chew your food slowly for better digestion.' },

  { category: 'Fitness', tip: 'Take a 5-minute walk after every meal.' },
  { category: 'Fitness', tip: 'Practice simple bodyweight exercises at home.' },
  { category: 'Fitness', tip: 'Maintain correct posture while sitting.' },
  { category: 'Fitness', tip: 'Warm up before starting any workout.' },
  { category: 'Fitness', tip: 'Cool down with light stretching after exercise.' },

  { category: 'Sleep', tip: 'Keep your bedroom cool and comfortable for better sleep.' },
  { category: 'Sleep', tip: 'Avoid caffeine late in the evening.' },
  { category: 'Sleep', tip: 'Create a relaxing bedtime routine.' },
  { category: 'Sleep', tip: 'Avoid using your phone immediately after waking up.' },
  { category: 'Sleep', tip: 'Try reading a book instead of scrolling before bed.' },

  { category: 'Mental Health', tip: 'Practice gratitude by noting three good things today.' },
  { category: 'Mental Health', tip: 'Spend at least 10 minutes away from digital screens.' },
  { category: 'Mental Health', tip: 'Smile more often—it can improve your mood.' },
  { category: 'Mental Health', tip: 'Listen to calming music if you feel anxious.' },
  { category: 'Mental Health', tip: 'Focus on one task at a time to reduce stress.' },

  { category: 'Heart Health', tip: 'Choose healthy cooking oils in moderation.' },
  { category: 'Heart Health', tip: 'Eat more fresh fruits instead of processed snacks.' },
  { category: 'Heart Health', tip: 'Manage stress to support heart health.' },
  { category: 'Heart Health', tip: 'Maintain a healthy body weight.' },
  { category: 'Heart Health', tip: 'Reduce consumption of processed foods.' },

  { category: "Women's Health", tip: 'Stay hydrated during your menstrual cycle.' },
  { category: "Women's Health", tip: 'Maintain personal hygiene during periods.' },
  { category: "Women's Health", tip: 'Consult a doctor if your cycle changes suddenly.' },
  { category: "Women's Health", tip: 'Eat calcium-rich foods for bone health.' },

  { category: 'General Health', tip: 'Wash fruits and vegetables before eating them.' },
  { category: 'General Health', tip: 'Avoid self-medication without medical advice.' },
  { category: 'General Health', tip: 'Keep emergency contact numbers easily accessible.' },
  { category: 'General Health', tip: 'Maintain good personal hygiene every day.' },




    { category: 'Eye Care', tip: 'Follow the 20-20-20 rule while using screens.' },
  { category: 'Eye Care', tip: 'Blink frequently to keep your eyes moist.' },
  { category: 'Eye Care', tip: 'Wear sunglasses when outdoors in bright sunlight.' },
  { category: 'Eye Care', tip: 'Adjust screen brightness to reduce eye strain.' },
  { category: 'Eye Care', tip: 'Get your eyes checked regularly.' },

  { category: 'Dental Care', tip: 'Brush your teeth twice a day.' },
  { category: 'Dental Care', tip: 'Floss daily to keep your gums healthy.' },
  { category: 'Dental Care', tip: 'Replace your toothbrush every three months.' },
  { category: 'Dental Care', tip: 'Limit sugary foods to protect your teeth.' },
  { category: 'Dental Care', tip: 'Visit a dentist for regular check-ups.' },

  { category: 'Bone Health', tip: 'Include calcium-rich foods in your diet.' },
  { category: 'Bone Health', tip: 'Get enough Vitamin D from sunlight safely.' },
  { category: 'Bone Health', tip: 'Strength training helps maintain bone strength.' },
  { category: 'Bone Health', tip: 'Avoid excessive soft drinks for better bone health.' },
  { category: 'Bone Health', tip: 'Maintain a healthy body weight for stronger bones.' },

  { category: 'Respiratory Health', tip: 'Avoid smoking and second-hand smoke.' },
  { category: 'Respiratory Health', tip: 'Practice deep breathing exercises daily.' },
  { category: 'Respiratory Health', tip: 'Keep indoor spaces well ventilated.' },
  { category: 'Respiratory Health', tip: 'Wear a mask in dusty environments.' },
  { category: 'Respiratory Health', tip: 'Stay hydrated to support healthy airways.' },

  { category: 'First Aid', tip: 'Keep a fully stocked first aid kit at home.' },
  { category: 'First Aid', tip: 'Learn basic CPR from a certified instructor.' },
  { category: 'First Aid', tip: 'Clean small wounds with clean water before dressing them.' },
  { category: 'First Aid', tip: 'Apply pressure to control bleeding until help arrives.' },
  { category: 'First Aid', tip: 'Call emergency services immediately in serious situations.' },

  { category: 'General Health', tip: 'Maintain a healthy work-life balance.' },
  { category: 'General Health', tip: 'Avoid prolonged exposure to loud noise.' },
  { category: 'General Health', tip: 'Read medicine labels carefully before use.' },
  { category: 'General Health', tip: 'Store medicines away from children.' },
  { category: 'General Health', tip: 'Avoid sharing personal hygiene items.' },

  { category: 'Nutrition', tip: 'Eat seasonal fruits whenever possible.' },
  { category: 'Nutrition', tip: 'Choose healthy snacks instead of junk food.' },
  { category: 'Nutrition', tip: 'Limit processed meat consumption.' },
  { category: 'Nutrition', tip: 'Drink fresh milk or fortified alternatives regularly.' },
  { category: 'Nutrition', tip: 'Read food labels before buying packaged foods.' },

  { category: 'Fitness', tip: 'Walk for at least 8,000 steps daily if possible.' },
  { category: 'Fitness', tip: 'Exercise with proper breathing techniques.' },
  { category: 'Fitness', tip: 'Stay active even on busy workdays.' },
  { category: 'Fitness', tip: 'Avoid skipping warm-up and cool-down sessions.' },
  { category: 'Fitness', tip: 'Regular movement improves overall health.' },

  { category: 'Mental Health', tip: 'Celebrate small achievements every day.' },
  { category: 'Mental Health', tip: 'Take breaks from social media regularly.' },
  { category: 'Mental Health', tip: 'Practice mindfulness for a few minutes daily.' },
  { category: 'Mental Health', tip: 'Do something you enjoy every week.' },
  { category: 'Mental Health', tip: 'Seek professional help if stress becomes overwhelming.' },

  { category: 'Heart Health', tip: 'Monitor your cholesterol levels regularly.' },
  { category: 'Heart Health', tip: 'Avoid excessive consumption of processed sugar.' },
  { category: 'Heart Health', tip: 'Practice relaxation techniques to lower stress.' },
  { category: 'Heart Health', tip: 'Stay physically active throughout the week.' },
  { category: 'Heart Health', tip: 'Choose fresh foods over highly processed meals.' }
]

export default healthTips