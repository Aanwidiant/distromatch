export function calculateOverallRating(data: {
    performance_rating: number;
    stability_rating: number;
    features_rating: number;
    support_rating: number;
    ux_rating: number;
}): string {
    return (
        (data.performance_rating +
            data.stability_rating +
            data.features_rating +
            data.support_rating +
            data.ux_rating) /
        5
    ).toFixed(2);
}
