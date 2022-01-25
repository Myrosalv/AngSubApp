import asyncio
import websockets
import json
import random


async def handler(websocket):
	async for message in websocket:
		data = None
		try:
			data = json.loads(message)
		except json.JSONDecodeError:
			pass

		if not data or not 'e' in data:
			continue

		print(data)
		task = None
		if data['e'] == 'SUBSCRIBE':
			if not task == None:
				continue

			async def send():
				while True:
					await websocket.send(json.dumps({'e': 'PRICE', 'p': {'value': random.uniform(80, 100)}}))
					await asyncio.sleep(3)
			task = asyncio.create_task(send())
		elif data['e'] == 'UNSUBSCRIBE':
			if task == None:
				continue

			task.cancel()
			task = None
			pass


async def main():
	async with websockets.serve(handler, "localhost", 3003):
		await asyncio.Future()

asyncio.run(main())
