import requests
import json
from django.http import JsonResponse
from decouple import config
from django.views.decorators.csrf import csrf_exempt





@csrf_exempt
def get_chatbot_response(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)
    user_message = data.get('message')

    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = json.dumps({
        "messages": [
            {"role": "system", "content": "You are a helpful environmental assistant for Ecoberg."},
            {"role": "user", "content": user_message}
        ],
        "model": "llama-3.3-70b-versatile",
        "temperature": 0
    })
    headers = {
        'Authorization': f'Bearer {config("GROQ_API_KEY")}',
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print("Status:", response.status_code)
    print("Body:", response.text)

    if response.status_code == 200:
        chatbot_reply = response.json()['choices'][0]['message']['content']
        return JsonResponse({'reply': chatbot_reply})
    else:
        return JsonResponse({'error': 'Failed to get response'}, status=500)