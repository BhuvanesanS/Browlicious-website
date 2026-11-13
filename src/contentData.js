// Clinic Asset Imports
import aboutImg from './assets/about.jpg'
import academyImg from './assets/academy-team.png'
import browTreatmentImg from './assets/brow-treatment.jpg'
import browsImg from './assets/brows-before-after.png'
import founderImg from './assets/founder.png'
import galleryThreeImg from './assets/gallery-3.jpeg'
import galleryFourImg from './assets/gallery-4.png'
import galleryFiveImg from './assets/gallery-5.jpg'
import heroImg from './assets/hero.jpg'
import lipBlushImg from './assets/lip-blush.jpg'
import pmuServiceImg from './assets/pmu-service.jpg'
import pmuClinicLogo from './assets/pmu-clinic-logo.png'
import testimonialEyelinerBeforeImg from './assets/testimonial-eyeliner-before.jpg'
import testimonialEyelinerCloseupImg from './assets/testimonial-eyeliner-closeup.jpg'
import testimonialBrowsNaturalImg from './assets/testimonial-brows-natural.jpg'
import testimonialBrowsResultImg from './assets/testimonial-brows-result.jpg'
import testimonialBrowsClinicImg from './assets/testimonial-brows-clinic.jpg'
import testimonialLipsRestImg from './assets/testimonial-lips-rest.jpg'
import testimonialLipsResultImg from './assets/testimonial-lips-result.jpg'

export const CLINIC_INFO = {
  name: 'Browlicious',
  city: 'Chennai',
  founder: 'Durga',
  phone: '97103 31111',
  phoneCall: '+919710331111',
  whatsappUrl: 'https://wa.me/919710331111',
  email: 'support@browlicious.in',
  address: 'First Floor, AA-117, 4th Ave, Shanthi Colony, Anna Nagar East, Chennai, Tamil Nadu 600040',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('First Floor, AA-117, 4th Ave, Shanthi Colony, Anna Nagar East, Chennai, Tamil Nadu 600040'),
  instagramUrl: 'https://www.instagram.com/browlicious_permanent_makeup/',
  hours: 'Monday – Sunday: 10:00 AM – 8:00 PM (By Appointment Only)'
}

export const ASSETS = {
  aboutImg,
  academyImg,
  browTreatmentImg,
  browsImg,
  founderImg,
  galleryThreeImg,
  galleryFourImg,
  galleryFiveImg,
  heroImg,
  lipBlushImg,
  pmuServiceImg,
  pmuClinicLogo,
  testimonialEyelinerBeforeImg,
  testimonialEyelinerCloseupImg,
  testimonialBrowsNaturalImg,
  testimonialBrowsResultImg,
  testimonialBrowsClinicImg,
  testimonialLipsRestImg,
  testimonialLipsResultImg
}

// All 14 Individual Services with Complete Conversion-Focused Copy
export const INDIVIDUAL_SERVICES = {
  'microblading': {
    slug: 'microblading',
    category: 'Brows',
    name: 'Microblading',
    headline: 'Fine hair-stroke brows that look like your own.',
    intro: 'Microblading uses a handheld tool to create ultra-fine, hair-like strokes that follow your natural growth pattern. It is the go-to for sparse, patchy or over-plucked brows when you want a soft, realistic finish with no makeup look.',
    idealFor: 'Normal to dry skin, thin or gappy brows, and anyone who wants a natural, feathery effect.',
    whatToExpect: 'Consultation and brow mapping (symmetry, arch, length), pigment colour match, numbing, then stroke work. Sessions take about 2 to 3 hours. Brows look darker for 7 to 10 days, then soften to the final shade.',
    healingAndLongevity: 'Light flaking in week one, a soft "ghost" phase around weeks 2 to 3, and a perfecting session at 6 to 8 weeks. Results typically last 12 to 18 months, with annual colour refreshes.',
    notIdealIf: 'You have very oily or textured skin (ombre or combination may suit better), or are pregnant, breastfeeding or undergoing chemotherapy.',
    price: '₹14,999 (Includes Touch-up)',
    duration: '2 to 3 Hours',
    painLevel: '1 / 5 (Gentle Numbing Applied)',
    cta: 'Book your brow consultation',
    seoTitle: 'Microblading in Chennai | Natural Hair-Stroke Brows | Browlicious',
    image: browsImg,
    showBrowComparison: true
  },
  'ombre-brows': {
    slug: 'ombre-brows',
    category: 'Brows',
    name: 'Ombre (Powder) Brows',
    headline: 'Soft, brushed-on definition, like brow makeup that never fades overnight.',
    intro: 'Ombre brows use tiny dots of pigment to create a soft powdered gradient, lighter at the front and gently defined through the tail. The effect is polished and symmetrical without visible hair strokes.',
    idealFor: 'Oily or combination skin, mature skin, anyone who likes a defined, filled-in brow, and those who find strokes too fine to hold.',
    whatToExpect: 'Brow mapping and shape approval, pigment selection, numbing, then shading. Brows look noticeably stronger during the first week, then settle 30 to 40 percent lighter once healed.',
    healingAndLongevity: 'Typically 18 to 36 months, with a perfecting session at 6 to 8 weeks and refreshes as the colour fades.',
    notIdealIf: 'Those seeking bare skin feathery individual strokes (microblading suits better). Pregnant or nursing mothers.',
    price: '₹15,999 (Includes Touch-up)',
    duration: '2.5 Hours',
    painLevel: '1 / 5 (Mild Sensation)',
    cta: 'Book your ombre brow consultation',
    seoTitle: 'Ombre Powder Brows in Chennai | Browlicious',
    image: browTreatmentImg,
    showBrowComparison: true
  },
  'combination-brows': {
    slug: 'combination-brows',
    category: 'Brows',
    name: 'Combination Brows',
    headline: 'Strokes for realism. Shading for depth. The best of both.',
    intro: 'Combination brows blend delicate hair strokes at the front with soft powder shading through the body and tail. You get natural-looking hairs, a fuller shape and extra staying power, which makes this our most requested brow service.',
    idealFor: 'Almost every skin type, brows with gaps and thin tails, and anyone who wants definition with a softer front.',
    whatToExpect: 'Golden-ratio brow mapping, shade customisation, numbing, front micro-strokes, followed by airy ombre shading through the arch and tail.',
    healingAndLongevity: 'Typically 18 to 24 months, with a perfecting session included at 6 to 8 weeks.',
    notIdealIf: 'Active skin infections or open cuts around the brow region.',
    price: '₹16,999 (Includes Touch-up)',
    duration: '2.5 to 3 Hours',
    painLevel: '1 / 5 (Comfort Protocol)',
    cta: 'Book your combination brow consultation',
    seoTitle: 'Combination Brows in Chennai | Microblading and Shading | Browlicious',
    image: testimonialBrowsResultImg,
    showBrowComparison: true
  },
  'lip-blush': {
    slug: 'lip-blush',
    category: 'Lips & Eyes',
    name: 'Lip Blush',
    headline: 'Your lips, only softer, fuller-looking and always tinted.',
    intro: 'Lip blush adds a soft, sheer wash of colour that defines your lip shape, balances asymmetry and brightens a flat or pale lip. There is no hard liner, just a fresh "just-bitten" tint that fades gracefully.',
    idealFor: 'Pale or uneven lips, lost definition with age, and anyone tired of reapplying lip colour throughout the day.',
    whatToExpect: 'Lip mapping, shade testing against your undertone, numbing, then layered pigment. Lips look swollen and intense for 1 to 3 days and soften to a pastel tint as they heal. A perfecting session follows at 6 to 8 weeks.',
    healingAndLongevity: 'Typically 2 to 3 years, fading gradually over time.',
    notIdealIf: 'If you are prone to cold sores, tell us at booking. Preventive medication from your doctor is needed before treatment. Active oral herpes or severely chapped/split lips.',
    price: '₹15,999 (Includes Touch-up)',
    duration: '2.5 Hours',
    painLevel: '1.5 / 5 (Topical Anesthetic)',
    cta: 'Book your lip blush consultation',
    seoTitle: 'Lip Blush in Chennai | Permanent Lip Tint | Browlicious',
    image: lipBlushImg
  },
  'dark-lip-correction': {
    slug: 'dark-lip-correction',
    category: 'Lips & Eyes',
    name: 'Dark Lip Pigmentation Correction',
    headline: 'Even out dark lips and reveal a healthier natural tone.',
    intro: 'Dark or uneven lip tone can come from sun exposure, genetics, smoking, medication or old inflammation. We use colour-correcting pigment to neutralise grey, brown and purple tones, then build a balanced, natural-looking lip colour.',
    idealFor: 'Two-tone lips, hyperpigmentation, smokers lips, and cool/purple-toned lip borders seeking a warm, healthy pink or peach.',
    whatToExpect: 'A skin assessment, colour analysis and often a test patch come first. Correction is gradual and typically needs 2 to 3 sessions, because we neutralise before we colour.',
    healingAndLongevity: 'Outcomes vary with skin depth and tone. Typically lasts 2 to 3 years once fully neutralized. We will tell you honestly at consultation what is realistic.',
    notIdealIf: 'Active cold sores, pregnancy, or uncontrolled skin conditions.',
    price: '₹16,999 (Includes 2 Neutralization Sessions)',
    duration: '2.5 Hours / session',
    painLevel: '1.5 / 5',
    cta: 'Book your lip neutralization consultation',
    seoTitle: 'Dark Lip Pigmentation Treatment in Chennai | Browlicious',
    image: testimonialLipsResultImg
  },
  'cheek-blush': {
    slug: 'cheek-blush',
    category: 'Skin & Aesthetics',
    name: 'Permanent Cheek Blush',
    headline: 'A healthy flush that stays when the makeup is off.',
    intro: 'Permanent cheek blush deposits a faint, diffused wash of colour on the apples of the cheeks for a natural "just back from a walk" glow. It suits pale complexions, tired-looking skin and anyone who loves a lifted, fresh look.',
    idealFor: 'Pale, fatigued or sallow complexions, gym and beach enthusiasts, and women who want effortless everyday radiance.',
    whatToExpect: 'Placement is everything, so we map to your cheekbones and keep the shade subtle and skin-tone matched. Healing takes about a week, and results fade softly rather than sharply.',
    healingAndLongevity: 'Typically 12 to 24 months, with graceful, soft fading.',
    notIdealIf: 'Active cystic facial acne, severe rosacea flare-up, or sunburn in the cheek region.',
    price: '₹12,000',
    duration: '90 Mins',
    painLevel: '1 / 5 (Very Gentle)',
    cta: 'Book your cheek blush consultation',
    seoTitle: 'Permanent Cheek Blush in Chennai | Browlicious',
    image: galleryThreeImg
  },
  'eyeliner': {
    slug: 'eyeliner',
    category: 'Lips & Eyes',
    name: 'Permanent Eyeliner',
    headline: 'Wake up with eyes already defined.',
    intro: 'From a barely-there lash enhancement to a classic liner or soft wing, permanent eyeliner suits busy mornings, active lifestyles, contact lens wearers and anyone who has trouble applying liner.',
    idealFor: 'Sparse eyelashes, active sports/gym goers, contact lens wearers, and anyone wanting crisp eyes without smudging.',
    whatToExpect: 'Numbing, then fine pigment placed at or between the lash line. Expect swelling for 24 to 48 hours, and plan for no eye makeup for a week.',
    healingAndLongevity: 'Typically 2 to 5 years depending on style and skin.',
    notIdealIf: 'You have active eye infections, severe dry eye, or have recently had eye surgery. We will always check first.',
    price: '₹9,999 - ₹13,999',
    duration: '90 - 120 Mins',
    painLevel: '1 / 5 (Ophthalmic Numbing Gel)',
    cta: 'Book your permanent eyeliner consultation',
    seoTitle: 'Permanent Eyeliner in Chennai | Browlicious',
    image: galleryFourImg
  },
  'smp-men': {
    slug: 'smp-men',
    category: 'Scalp Micropigmentation',
    name: 'SMP for Men',
    headline: 'A sharper hairline and a fuller look, without surgery.',
    intro: 'Scalp micropigmentation places thousands of tiny pigment dots that replicate the look of hair follicles. Use it for a clean shaved-head look, to rebuild a receding hairline, add density to thinning areas or blend a transplant or scar.',
    idealFor: 'Receding hairlines, male pattern baldness, diffuse crown thinning, and hair transplant scar camouflage.',
    whatToExpect: 'A hairline is designed with you first, matched to your age, face shape and natural growth. Treatment is built over 2 to 3 sessions, a week or two apart, so the density looks natural and not flat.',
    healingAndLongevity: 'Mild redness for 1 to 3 days. Avoid washing the scalp, sweating and sun for the first 4 days. Results typically last 4 to 6 years before a refresh.',
    notIdealIf: 'Active psoriasis or open lesions on the scalp.',
    price: '₹15,000 - ₹35,000 (Based on Norwood Scale)',
    duration: '2 to 3 Hours / session',
    painLevel: '2 / 5 (Mild Sensation)',
    cta: 'Book your male SMP consultation',
    seoTitle: 'Scalp Micropigmentation for Men in Chennai | Browlicious',
    image: pmuServiceImg
  },
  'smp-women': {
    slug: 'smp-women',
    category: 'Scalp Micropigmentation',
    name: 'SMP for Women',
    headline: 'Visible scalp, softer. Thinning hair, fuller-looking.',
    intro: 'For women with diffuse thinning, widening partlines, alopecia or traction hair loss, SMP creates the look of density and reduces scalp contrast. It works with your existing hair, so shaving is rarely needed.',
    idealFor: 'Widening center parts, postpartum thinning, alopecia, and crown hair density loss.',
    whatToExpect: 'Female SMP is lighter and more diffused than male SMP. We match your hair colour and texture so the result stays undetectable, even up close. Treatment takes 2 to 3 sessions.',
    healingAndLongevity: 'Typically lasts 4 to 6 years. SMP does not regrow hair; it is a cosmetic solution that disguises thinning and scarring.',
    notIdealIf: 'Active scalp eczema or uncontrolled hair shed under medical treatment.',
    price: '₹15,000 - ₹30,000',
    duration: '2 Hours / session',
    painLevel: '1.5 / 5',
    cta: 'Book your female SMP consultation',
    seoTitle: 'Scalp Micropigmentation for Women in Chennai | Browlicious',
    image: pmuServiceImg
  },
  'paramedical': {
    slug: 'paramedical',
    category: 'Paramedical Tattooing',
    name: 'Paramedical Tattooing: Overview',
    headline: 'Skin restoration with sensitivity, discretion and care.',
    intro: 'Paramedical tattooing uses PMU techniques to restore the colour and appearance of skin affected by scars, surgery, burns or pigment loss. Our approach is gentle, private and unhurried. We work with your doctor or surgeon where needed, and we are always upfront about what can realistically be achieved. Results are cosmetic and vary from person to person.',
    idealFor: 'Post-surgical scars, stable vitiligo, mature stretch marks, and post-mastectomy areola reconstruction.',
    whatToExpect: 'Free consultation, skin assessment, test patch and a written plan. Healing must be complete and stable first.',
    healingAndLongevity: 'Depends on scar depth and tissue vascularity. Typically 2 to 4 years before subtle touch-ups.',
    notIdealIf: 'Active or unstable scars less than 12 months old, raised keloids without clearance, or spreading vitiligo.',
    price: 'Custom quote based on area',
    duration: '1 to 3 Hours',
    painLevel: '1 / 5',
    cta: 'Book a confidential paramedical consultation',
    seoTitle: 'Paramedical Tattooing in Chennai | Skin Restoration | Browlicious',
    image: aboutImg
  },
  'vitiligo-camouflage': {
    slug: 'vitiligo-camouflage',
    category: 'Paramedical Tattooing',
    name: 'Vitiligo Camouflage',
    headline: 'Reduce contrast. Restore confidence.',
    intro: 'We implant pigment matched to your surrounding skin tone to soften the look of stable vitiligo patches. Colour matching takes time, so we always begin with a small test area and review it before treating further.',
    idealFor: 'Stable, non-spreading vitiligo patches on the body or face seeking natural skin tone blending.',
    whatToExpect: 'Initial test spot to verify colour retention and healed shade, followed by multi-layered tone matching across 2 to 3 sessions.',
    healingAndLongevity: 'Vitiligo must be stable, with no new patches or spreading for at least 12 months, ideally confirmed by your dermatologist. Pigment can fade or shift over time, and touch-ups may be needed.',
    notIdealIf: 'Active, spreading vitiligo or active systemic autoimmune flare-ups.',
    price: '₹6,000 - ₹18,000 (Based on Patch Size)',
    duration: '1.5 to 2.5 Hours',
    painLevel: '1 / 5',
    cta: 'Book your vitiligo camouflage assessment',
    seoTitle: 'Vitiligo Camouflage Tattoo in Chennai | Browlicious',
    image: aboutImg
  },
  'stretch-mark-camouflage': {
    slug: 'stretch-mark-camouflage',
    category: 'Paramedical Tattooing',
    name: 'Stretch Mark Camouflage',
    headline: 'Soften the contrast of stretch marks.',
    intro: 'Skin-matched pigment is placed in mature, pale stretch marks to blend them with the surrounding skin. It reduces visible contrast but does not remove marks or change skin texture. Large areas may need several sessions.',
    idealFor: 'Marks that are fully mature (white or silvery), usually 1 to 2 years old, on hips, thighs, breasts, or abdomen.',
    whatToExpect: 'Custom tone mixing, micro-needling pigment dispersion directly inside striations. Healing involves light redness for 7 days followed by progressive blending.',
    healingAndLongevity: 'Long lasting cosmetic disguise (3+ years). Avoid direct sun tanning without SPF.',
    notIdealIf: 'Fresh, red or purple vascular stretch marks (must heal white first).',
    price: '₹8,000 - ₹22,000 (Per Area)',
    duration: '2 Hours',
    painLevel: '1.5 / 5',
    cta: 'Book your stretch mark camouflage consultation',
    seoTitle: 'Stretch Mark Camouflage in Chennai | Browlicious',
    image: aboutImg
  },
  'scar-coverage': {
    slug: 'scar-coverage',
    category: 'Paramedical Tattooing',
    name: 'Scar Coverage',
    headline: 'Blend scars into your skin tone.',
    intro: 'Surgical, accident and some burn scars can be camouflaged with colour-matched pigment, which reduces how noticeable they are. Outcomes depend on scar type, depth and texture, and some scars respond better than others. We will tell you honestly at consultation.',
    idealFor: 'Fully healed pale surgical scars (C-section, thyroidectomy, tummy tuck, facelift, accidents).',
    whatToExpect: 'Scars must be fully healed and stable, typically at least 12 months old. Raised, keloid or active scars are assessed individually and often need medical clearance.',
    healingAndLongevity: 'Typically 2 to 4 years. Semi-permanent medical pigments fade gently.',
    notIdealIf: 'Hypertrophic or active red keloid scars without physician clearance.',
    price: '₹5,000 - ₹15,000 (Per Scar Area)',
    duration: '1 to 2 Hours',
    painLevel: '1 / 5',
    cta: 'Book your scar camouflage consultation',
    seoTitle: 'Scar Camouflage Tattoo in Chennai | Browlicious',
    image: aboutImg
  },
  'areola-reconstruction': {
    slug: 'areola-reconstruction',
    category: 'Paramedical Tattooing',
    name: 'Areola Reconstruction',
    headline: 'A gentle final step after breast surgery.',
    intro: 'For breast cancer survivors and anyone who has had breast surgery, areola and nipple tattooing can recreate the natural look of the areola using realistic shading, and 3D effects where suitable. Many clients describe it as the moment they feel complete again. We take the time you need, in a private, supportive space.',
    idealFor: 'Post-mastectomy breast reconstruction, breast reduction or lift scars, and asymmetric areolas.',
    whatToExpect: 'Design and colour matching, numbing where sensation allows (many clients have little or none), then treatment in 1 to 2 sessions. A touch-up follows at 6 to 8 weeks.',
    healingAndLongevity: 'Once surgery and radiotherapy are complete, healing is finished and your surgeon has cleared you, typically 3 to 6 months after surgery. Please bring your clearance letter to consultation.',
    notIdealIf: 'Ongoing active chemotherapy or radiation therapy without oncologist release.',
    price: 'Concessional & Supportive Pricing Available',
    duration: '2 Hours',
    painLevel: '0 - 1 / 5 (Comfort First)',
    cta: 'Book a private, sensitive consultation',
    seoTitle: 'Areola Tattoo After Breast Surgery in Chennai | Browlicious',
    image: aboutImg
  }
}

// Brow Technique Comparison Matrix
export const BROW_COMPARISON_TABLE = [
  {
    technique: 'Microblading',
    look: 'Natural hair strokes',
    bestSkin: 'Normal to dry',
    longevity: '12 to 18 months',
    slug: 'microblading'
  },
  {
    technique: 'Ombre brows',
    look: 'Soft, powdered makeup effect',
    bestSkin: 'Oily to combination',
    longevity: '18 to 36 months',
    slug: 'ombre-brows'
  },
  {
    technique: 'Combination brows',
    look: 'Strokes plus shading',
    bestSkin: 'Most skin types',
    longevity: '18 to 24 months',
    slug: 'combination-brows'
  }
]

// Academy Courses Matrix
export const ACADEMY_COURSES = [
  {
    name: 'Foundation Brows',
    covers: 'Microblading, ombre, combination brows',
    duration: '5 Days',
    level: 'Beginner'
  },
  {
    name: 'Lips and Eyeliner',
    covers: 'Lip blush, dark lip correction, eyeliner, cheek blush',
    duration: '4 Days',
    level: 'Beginner/intermediate'
  },
  {
    name: 'SMP Masterclass',
    covers: 'Male and female scalp micropigmentation',
    duration: '3 Days',
    level: 'All levels'
  },
  {
    name: 'Paramedical Tattooing',
    covers: 'Scars, stretch marks, vitiligo, areola reconstruction',
    duration: '4 Days',
    level: 'Advanced'
  },
  {
    name: 'Corrective and Colour Theory',
    covers: 'Fixing old work, colour correction & neutralization',
    duration: '2 Days',
    level: 'Advanced'
  },
  {
    name: 'Mentorship and Refresher',
    covers: 'One-to-one practice for qualified artists',
    duration: 'Flexible (1-2 Days)',
    level: 'Qualified artists'
  }
]

// 12-Week Blog Editorial Content Plan
export const BLOG_EDITORIAL_PLAN = [
  { week: 1, title: 'Microblading vs Ombre vs Combination Brows', audience: 'Client', keyword: 'microblading vs ombre brows' },
  { week: 2, title: 'Microblading Healing Stages, Day by Day', audience: 'Client', keyword: 'microblading healing process' },
  { week: 3, title: 'How to Become a PMU Artist in Chennai', audience: 'Academy', keyword: 'become a PMU artist' },
  { week: 4, title: 'Lip Blush: Cost, Pain, Healing and Results', audience: 'Client', keyword: 'lip blush Chennai' },
  { week: 5, title: 'Scalp Micropigmentation: Complete Guide', audience: 'Client', keyword: 'scalp micropigmentation' },
  { week: 6, title: 'What to Look for in a PMU Training Course', audience: 'Academy', keyword: 'PMU training course' },
  { week: 7, title: 'Can Tattooing Cover Scars? What to Expect', audience: 'Client', keyword: 'scar camouflage tattoo' },
  { week: 8, title: 'Areola Reconstruction After Breast Cancer', audience: 'Client', keyword: 'areola tattoo after mastectomy' },
  { week: 9, title: 'Vitiligo Camouflage Tattoo: Is It Right for You?', audience: 'Client', keyword: 'vitiligo camouflage' },
  { week: 10, title: '7 Mistakes New PMU Artists Make', audience: 'Academy', keyword: 'PMU mistakes' },
  { week: 11, title: 'Dark Lip Pigmentation: Causes and Correction', audience: 'Client', keyword: 'dark lip treatment' },
  { week: 12, title: 'PMU Aftercare Mistakes That Ruin Results', audience: 'Client', keyword: 'PMU aftercare' }
]

// 7-Step PMU Journey
export const CLIENT_JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Free consultation',
    desc: 'We listen, assess your skin and discuss goals and suitability.'
  },
  {
    step: '02',
    title: 'Design and mapping',
    desc: 'We draw your shape, you approve it, nothing starts until you love it.'
  },
  {
    step: '03',
    title: 'Patch test',
    desc: 'Done at least 24 to 48 hours before treatment where needed.'
  },
  {
    step: '04',
    title: 'Treatment',
    desc: 'Numbing first, then pigment. Most sessions take 2 to 3 hours.'
  },
  {
    step: '05',
    title: 'Healing',
    desc: 'Written aftercare and a check-in message from our clinic team.'
  },
  {
    step: '06',
    title: 'Perfecting session',
    desc: 'At 6 to 8 weeks we refine shape and colour. It is included.'
  },
  {
    step: '07',
    title: 'Maintenance',
    desc: 'Colour refreshes when needed, usually every 12 to 24 months.'
  }
]

// Core FAQs
export const CLINIC_FAQS = [
  {
    q: 'Does PMU hurt?',
    a: 'Most clients feel pressure or scratching rather than pain. We use medical-grade topical numbing and check in throughout your session.'
  },
  {
    q: 'How long does it last?',
    a: 'Typically 1 to 3 years, depending on treatment, skin type, sun exposure and aftercare. PMU is semi-permanent and fades gradually.'
  },
  {
    q: 'Will my colour change as it heals?',
    a: 'Yes. Pigment looks darker at first and softens by 30 to 40 percent. Your artist chooses shades specifically with this healing curve in mind.'
  },
  {
    q: 'Is it safe?',
    a: 'We use single-use sterile needles, medical-grade pigments, strict sterilisation and a full health screen before every procedure.'
  },
  {
    q: 'What does it cost?',
    a: 'Prices depend on treatment and area (e.g. Microblading from ₹14,999, Lip Blush from ₹15,999). A perfecting touch-up session is included.'
  },
  {
    q: 'Can PMU be removed?',
    a: 'It can be faded with laser or saline, but removal is gradual and not always complete. Choose your artist carefully.'
  }
]
