export class WeatherItem {
    date: string;
    temperature: string;
    weather: string;
    icon: string;

    constructor(date: string, temperature: string, weather: string, icon: string) {
        this.date = date;
        this.temperature = temperature;
        this.weather = weather;
        this.icon = icon;
    }
}