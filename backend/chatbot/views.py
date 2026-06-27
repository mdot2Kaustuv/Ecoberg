import requests
import json
from django.http import JsonResponse
from decouple import config
from django.views.decorators.csrf import csrf_exempt




@csrf_exempt 
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
            "model": "llama-3.3-70b-versatile",
            "stream": False,
            "temperature": 1
        })
        headers = {
            'Authorization': f'Bearer {config("GROK_API_KEY")}',
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print("Status: ",response.status_code)
        print("Body:", response.text)  

                
        if response.status_code == 200:
            response_data = response.json()
            chatbot_reply = response_data['choices'][0]['message']['content']
            return JsonResponse({'reply': chatbot_reply})
        else:
            return JsonResponse({'error': 'Failed to get response from chatbot API'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

