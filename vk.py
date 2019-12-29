import vk_api as vk
import vk_api.bot_longpoll as longpoll
from random import randint

class vk_wrapper:
    
    def __init__(self, access_token, group_id, api_version = '5.103'):
        self.__group_id = group_id
        self.__vk_main = vk.VkApi(token = access_token, api_version = api_version)
        self.__server = longpoll.VkBotLongPoll(self.__vk_main, group_id)
        self.longpoll = longpoll
        self.__uploader = vk.upload.VkUpload(self.__vk_main)
        self.__event = None

    def listen(self):
        for event in self.__server.listen():
            self.__event = event.obj
            yield event

    @staticmethod
    def get_message_params(event, attachments = None):
        return {
            'user_id': event['peer_id'],
            'message': event['text'] if event['text']!='' else 'None',
            'random_id': randint(0, 99999999999999)
        }

    @staticmethod
    def get_full_message(event, vk_main):
        params = {
            'message_ids': event['id'],
            'preview_length': '0'
        }
        return vk_main.method('messages.getById', params)['items'][0]

    @staticmethod
    def get_attachments(message):
        result = message['attachments']
        for fwd_message in message.get('fwd_messages', []):
            result.extend(vk_wrapper.get_attachments(fwd_message))
        
        return result

    @staticmethod
    def filter_attachments(attachments, at_type):
        result = []
        for attachment in attachments:
            if (attachment['type'] == at_type):
                result.append(attachment[at_type])
        
        return result

    @staticmethod
    def get_photo_link(photo):
        sizes = ['s','m','x','o','p','q','r','y','z','w']
        best_size = max(photo['sizes'], key = lambda size: sizes.index(size['type']))
        return best_size['url']

    def get_photos_links(self):
        message = self.get_full_message(self.__event['message'], self.__vk_main)
        attachments = self.get_attachments(message)
        return [self.get_photo_link(photo) for photo in self.filter_attachments(attachments, 'photo')]

    def get_command(self):
        return self.__event['message']['text']

    def get_dialog_id(self):
        return self.__event['message']['peer_id']

    def send_message(self, message = '', attachment = None, ):
        peer_id = self.get_dialog_id()
        
        if not attachment is None:   
            attachment = self.__uploader.document_message(attachment, peer_id = peer_id)

        print('attachment', attachment)
        params = {
            'user_id': peer_id,
            'attachment': None if attachment is None else 'doc{owner_id}_{id}'.format(**attachment['doc']),
            'message': message,
            'random_id': randint(0, 99999999999)
        }
        self.__vk_main.method('messages.send', params)


    