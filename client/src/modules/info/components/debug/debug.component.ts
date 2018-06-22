import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {TodoService} from '../../../shared/services/base/todo.service';
import {PushNotificationService} from '../../../shared/services/pushNotification.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {ApiService} from '../../../shared/services/base/api.service';
import {WINDOW} from '../../../shared/services/window.token';

@Component({
    templateUrl: 'debug.component.html',
    styleUrls: ['debug.component.scss']
})
export class DebugComponent {
    @ViewChild('info')
    public info: ElementRef;
    public debugInfo = '';

    constructor(private _todoService: TodoService, private _pushNotificationService: PushNotificationService,
                private _notificationService: NotificationService, private _apiService: ApiService,
                @Inject(WINDOW) private _window: Window) {
    }

    public async clearDatabase(): Promise<void> {
        await this._todoService.clear();
        this._addDebugInfo('Database cleared.')
    }

    public unregisterPush(): void {
        this._pushNotificationService.unregister()
            .subscribe(success => {
                if (success) {
                    this._addDebugInfo('Push notifications unregistered.');
                } else {
                    this._addDebugInfo('Unregister push notification failed.')
                }
            });
    }

    public async unregisterServiceWorker(): Promise<void> {
        const registrations = await this._window.navigator.serviceWorker.getRegistrations();
        registrations.forEach(registration => registration.unregister());
        this._addDebugInfo('Service worker unregistered.');
    }

    public clearInfo(): void {
        this.debugInfo = '';
    }

    public showTestNotification(): void {
        this._notificationService.showNotification('PWA Workshop', 'Hello audience! Nice to meet you!');
    }

    public sendPushNotification(): void {
        this._apiService.post('push/notifyAll', {
            title: 'Push Notification',
            body: 'This is a push notification!'
        }).subscribe();
    }

    private _addDebugInfo(info: string) {
        this.debugInfo += `${info}\r\n`;
        this.info.nativeElement.scrollTop = this.info.nativeElement.scrollHeight;
    }
}
