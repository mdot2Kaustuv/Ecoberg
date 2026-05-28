class CarbonCalculator:

    def calculate(answers)  : 
        food_val = 3.0
        diet = answers.get('food_diet', 'standard_meat')
        if diet == 'vegan': food_val = 1.4
        elif diet == 'vegetarian': food_val = 1.7
        elif diet == 'pescatarian': food_val = 2.0
        elif diet == 'low_meat': food_val = 2.4
        elif diet == 'heavy_meat': food_val = 4.2

        food_local_mult = 1.0
        local = answers.get('food_local', 'occasionally')
        if local == 'always': food_local_mult = 0.85
        elif local == 'often': food_local_mult = 0.92
        elif local == 'rarely': food_local_mult = 1.10

        food_waste_mult = 1.0
        waste = answers.get('food_waste', 'low')
        if waste == 'zero': food_waste_mult = 0.88
        elif waste == 'low': food_waste_mult = 0.95
        elif waste == 'high': food_waste_mult = 1.20

        final_food = round(food_val * food_local_mult * food_waste_mult, 2)

        auto_val = 0.0
        commute_mode = answers.get('trans_commute', 'gas_car')
        raw_mileage = answers.get('trans_mileage', 100)
        try:
            mileage_weekly = float(raw_mileage)
        except (ValueError, TypeError):
            mileage_weekly = 100.0
        annual_commute_miles = mileage_weekly * 52

        if commute_mode != 'active_travel':
            if commute_mode == 'public_transit':
                auto_val = (annual_commute_miles * 0.12) / 1000
            else:
                car_size_mult = 0.35
                car_size = answers.get('trans_car_size', 'sedan')
                if car_size == 'suv_truck': car_size_mult = 0.45
                elif car_size == 'compact': car_size_mult = 0.25
                elif car_size == 'none': car_size_mult = 0

                fuel_mult = 1.0
                if commute_mode == 'electric_car': fuel_mult = 0.22
                elif commute_mode == 'hybrid_car': fuel_mult = 0.60

                auto_val = (annual_commute_miles * car_size_mult * fuel_mult) / 1000

        short_flights = float(answers.get('trans_flights_short', 2) or 0)
        long_flights = float(answers.get('trans_flights_long', 0) or 0)
        flights_val = (short_flights * 0.22) + (long_flights * 1.15)

        final_transport = round(auto_val + flights_val, 2)





        energy_baseline = 2.0
        energy_size = answers.get('energy_size', 'apartment')
        if energy_size == 'studio': energy_baseline = 0.9
        elif energy_size == 'apartment': energy_baseline = 1.5
        elif energy_size == 'townhouse': energy_baseline = 2.2
        elif energy_size == 'house_medium': energy_baseline = 3.2
        elif energy_size == 'house_large': energy_baseline = 4.8

        energy_renewable_mult = 1.0
        renewables = answers.get('energy_renewables', 'standard_grid')
        if renewables == 'full_solar': energy_renewable_mult = 0.60
        elif renewables == 'half_green': energy_renewable_mult = 0.82

        heating_mult = 1.0
        heating = answers.get('energy_heating', 'natural_gas')
        if heating == 'heat_pump': heating_mult = 0.80
        elif heating == 'electric_resist': heating_mult = 1.15
        elif heating == 'fuel_oil': heating_mult = 1.30

        final_energy = round(energy_baseline * energy_renewable_mult * heating_mult, 2)






        shopping_baseline = 1.5
        shopping_style = answers.get('shopping_intensity', 'moderate')
        if shopping_style == 'frugal': shopping_baseline = 0.6
        elif shopping_style == 'active': shopping_baseline = 3.2

        recycle_mult = 1.0
        recycle = answers.get('shopping_recycle', 'standard')
        if recycle == 'extensive': recycle_mult = 0.78
        elif recycle == 'poor': recycle_mult = 1.12

        device_mult = 1.0
        devices = answers.get('shopping_devices', 'periodic')
        if devices == 'annually': device_mult = 1.20
        elif devices == 'need': device_mult = 0.88

        final_shopping = round(shopping_baseline * recycle_mult * device_mult, 2)




        total_footprint = round(final_food + final_transport + final_energy + final_shopping, 2)
        score_val = max(5, min(100, round(100 - (total_footprint / 22.0) * 82.0)))





        recommendations = []
        if diet in ['heavy_meat', 'standard_meat']:
            recommendations.append({
                'id': 'rec_food_diet', 'title': 'Adopt Meatless Mondays',
                'description': 'Transitioning poultry or beef meals to plant-based grains once or twice a week heavily slices production land demand.',
                'impact': 'High', 'estimatedReduction': 0.65 if diet == 'heavy_meat' else 0.40, 'category': 'food',
            })
        if waste in ['high', 'medium']:
            recommendations.append({
                'id': 'rec_food_waste', 'title': 'Optimize Household Meal Prep',
                'description': 'Plan your grocery shopping in batches and inventory leftover items into soups.',
                'impact': 'Medium', 'estimatedReduction': 0.35 if waste == 'high' else 0.18, 'category': 'food',
            })
        if commute_mode == 'gas_car' and mileage_weekly > 75:
            recommendations.append({
                'id': 'rec_trans_commute', 'title': 'Switch to Hybrid or Electric Vehicle',
                'description': 'Transitioning fossil combustion to an EV or plug-in hybrid reduces travel emissions.',
                'impact': 'High', 'estimatedReduction': round(auto_val * 0.75, 2), 'category': 'transportation',
            })
            recommendations.append({
                'id': 'rec_trans_carpool', 'title': 'Initiate Carpooling or Public Transit Shifts',
                'description': 'Convert three weekly solo car trips into train commutes.',
                'impact': 'Medium', 'estimatedReduction': round(auto_val * 0.30, 2), 'category': 'transportation',
            })
        if (short_flights + long_flights) > 2:
            recommendations.append({
                'id': 'rec_trans_trains', 'title': 'Sub local flights with rail transit',
                'description': 'Opt for electric commuter rail over budget regional short-haul flight connections under 4 hours.',
                'impact': 'Medium', 'estimatedReduction': round((short_flights * 0.22) * 0.8, 2), 'category': 'transportation',
            })
        if renewables == 'standard_grid':
            recommendations.append({
                'id': 'rec_energy_solar', 'title': 'Subscribe to Green Utility Tariffs',
                'description': 'Consult your power carrier for zero-carbon pricing models or purchase shares in solar farms.',
                'impact': 'High', 'estimatedReduction': round(final_energy * 0.35, 2), 'category': 'energy',
            })
        if heating in ['natural_gas', 'fuel_oil']:
            recommendations.append({
                'id': 'rec_energy_heatpump', 'title': 'Optimize Heating with Electric Heat Pump',
                'description': 'State-of-the-art air/water source heat pumps deliver higher thermal performance coefficients.',
                'impact': 'High', 'estimatedReduction': 1.10 if heating == 'fuel_oil' else 0.55, 'category': 'energy',
            })
        if shopping_style == 'active':
            recommendations.append({
                'id': 'rec_shop_thrift', 'title': 'Leverage Consignment & Secondhand Cycles',
                'description': 'Buy fashion and designer items from high-grade secondhand digital platforms.',
                'impact': 'Medium', 'estimatedReduction': 0.85, 'category': 'shopping',
            })
        if devices in ['annually', 'periodic']:
            recommendations.append({
                'id': 'rec_shop_electronics', 'title': 'Extend Electronics Refurbishment Cycles',
                'description': 'Keep your smartphone and notebook on 4-5 year lifespans.',
                'impact': 'Low', 'estimatedReduction': 0.15, 'category': 'shopping',
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