import requests
import json
from django.http import JsonResponse
from decouple import config




def get_chatbot_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message')

        url = "https://api.x.ai/v1/chat/completions"

        payload = json.dumps({
            "messages": [
                {
                    "role": "system",
                    "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            "model": "grok-4-1-fast",
            "stream": False,
            "temperature": 1
        })
        headers = {
            'Authorization': f'Bearer {config("GROK_API_KEY")}',
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        if response.status_code == 200:
            response_data = response.json()
            chatbot_reply = response_data['choices'][0]['message']['content']
            return JsonResponse({'reply': chatbot_reply})
        else:
            return JsonResponse({'error': 'Failed to get response from chatbot API'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

