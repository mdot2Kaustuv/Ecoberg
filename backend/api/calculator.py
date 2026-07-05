class CarbonCalculator:

    def calculate(self, answers):

        food_val = 1.8
        diet = answers.get('food_diet', 'regional_non_veg')
        if diet == 'vegan': food_val = 0.9
        elif diet == 'pure_vegetarian': food_val = 1.1
        elif diet == 'lacto_ovo_vegetarian': food_val = 1.3  # ✅ fixed key
        elif diet == 'low_meat': food_val = 1.6
        elif diet == 'heavy_meat': food_val = 2.8

        food_waste_mult = 1.0
        waste = answers.get('food_waste', 'low')
        if waste == 'zero': food_waste_mult = 0.85
        elif waste == 'low': food_waste_mult = 0.95
        elif waste == 'high': food_waste_mult = 1.25

        final_food = round(food_val * food_waste_mult, 2)

        auto_val = 0.0
        commute_mode = answers.get('trans_commute', 'two_wheeler')
        raw_distance = answers.get('trans_distance_weekly', 100)

        try:
            km_weekly = float(raw_distance)
        except (ValueError, TypeError):
            km_weekly = 100.0
        annual_commute_km = km_weekly * 52

        if commute_mode != 'active_travel':
            if commute_mode == 'public_transit':
                auto_val = (annual_commute_km * 0.03) / 1000
            elif commute_mode == 'auto_rickshaw':
                auto_val = (annual_commute_km * 0.05) / 1000
            elif commute_mode == 'two_wheeler':
                auto_val = (annual_commute_km * 0.04) / 1000
            else:
                car_size_mult = 0.16
                car_size = answers.get('trans_car_size', 'hatchback')
                if car_size == 'suv_luxury': car_size_mult = 0.24
                elif car_size == 'hatchback': car_size_mult = 0.12
                elif car_size == 'none': car_size_mult = 0

                fuel_mult = 1.0
                if commute_mode == 'electric_car': fuel_mult = 0.35
                elif commute_mode == 'cng_hybrid_car': fuel_mult = 0.70

                auto_val = (annual_commute_km * car_size_mult * fuel_mult) / 1000

        short_flights = float(answers.get('trans_flights_short', 0) or 0)
        long_flights = float(answers.get('trans_flights_long', 0) or 0)
        flights_val = (short_flights * 0.15) + (long_flights * 1.10)

        final_transport = round(auto_val + flights_val, 2)

        energy_baseline = 1.0
        energy_size = answers.get('energy_size', 'apartment_medium')
        if energy_size == 'room_shared': energy_baseline = 0.3
        elif energy_size == 'apartment_small': energy_baseline = 0.6
        elif energy_size == 'apartment_medium': energy_baseline = 1.2
        elif energy_size == 'independent_house': energy_baseline = 2.2

        ac_mult = 1.0
        ac_usage = answers.get('energy_ac', 'seasonal')
        if ac_usage == 'none': ac_mult = 0.60
        elif ac_usage == 'heavy': ac_mult = 1.50

        cooking_mult = 1.0
        cooking_fuel = answers.get('energy_cooking', 'lpg')
        if cooking_fuel == 'induction_electric': cooking_mult = 0.90
        elif cooking_fuel == 'biomass_wood': cooking_mult = 1.40

        final_energy = round(energy_baseline * ac_mult * cooking_mult, 2)

        shopping_baseline = 0.5
        shopping_style = answers.get('shopping_intensity', 'moderate')
        if shopping_style == 'frugal': shopping_baseline = 0.2
        elif shopping_style == 'active': shopping_baseline = 1.8

        final_shopping = round(shopping_baseline, 2)

        total_footprint = round(final_food + final_transport + final_energy + final_shopping, 2)

        score_val = max(5, min(100, round(100 - (total_footprint / 6.0) * 85.0)))

        recommendations = []

       
        if diet in ['heavy_meat', 'regional_non_veg', 'low_meat']:
            recommendations.append({
                'id': 'rec_food_diet',
                'title': 'Incorporate More Plant-Based Days',
                'description': 'Swapping a few chicken or mutton meals for local lentil (dal) pulses dramatically lowers agricultural footprint.',
                'impact': 'Medium',
                'estimatedReduction': 0.30,
                'category': 'food',
            })

      
        if commute_mode in ['gas_car', 'two_wheeler', 'auto_rickshaw']:
            recommendations.append({
                'id': 'rec_trans_public',
                'title': 'Shift Commutes to Metro or Electric Public Transit',
                'description': 'Opting for city electric buses or metro lines over solo vehicle travel cuts gridlocked traffic idling emissions.',
                'impact': 'High',
                'estimatedReduction': round(auto_val * 0.50, 2) if auto_val > 0 else 0.20,
                'category': 'transportation',
            })

        if ac_usage in ['heavy', 'seasonal']:  # ✅ loosened: seasonal too
            recommendations.append({
                'id': 'rec_energy_ac',
                'title': 'Set Air Conditioning to 24°C or Eco Mode',
                'description': 'Keeping your AC baseline at 24°C instead of 18°C reduces appliance electricity pull by up to 24%.',
                'impact': 'High' if ac_usage == 'heavy' else 'Medium',
                'estimatedReduction': round(final_energy * 0.25, 2),
                'category': 'energy',
            })

        if cooking_fuel in ['lpg', 'biomass_wood']:  # ✅ loosened: biomass too
            recommendations.append({
                'id': 'rec_energy_cooking',
                'title': 'Transition to Electric Induction Cooking',
                'description': 'Pairing efficient electric induction cooktops lowers dependence on fossil LPG cylinders.',
                'impact': 'Low',
                'estimatedReduction': 0.10,
                'category': 'energy',
            })

        sorted_recs = sorted(recommendations, key=lambda x: x['estimatedReduction'], reverse=True)[:3]

        return {
            'total_footprint': total_footprint,
            'sustainability_score': score_val,
            'breakdown': {
                'food': final_food,
                'transportation': final_transport,
                'energy': final_energy,
                'shopping': final_shopping
            },
            'recommendations': sorted_recs
        }