export class WeatherItem {
    date: string;
    temperature: string;
    weatherId: number;
    icon: string;

    constructor(date: string, temperature: string, weatherId: number, icon: string) {
        this.date = date;
        this.temperature = temperature;
        this.weatherId = weatherId;
        this.icon = icon;
    }
}