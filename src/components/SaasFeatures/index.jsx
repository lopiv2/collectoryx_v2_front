import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

const Features = [
    {
        id: "app.license.features_collections_free",
        license: "Free",
        icon: "done",
        type: "min"
    },
    {
        id: "app.license.features_collections_premium",
        license: "Premium",
        icon: "done",
        type: "min"
    },
    {
        id: "app.license.features_rss_free",
        license: "Free",
        icon: "done",
        type: "min"
    },
    {
        id: "app.license.features_rss_premium",
        license: "Premium",
        icon: "done",
        type: "min"
    },
    {
        id: "app.license.features_metadata_free",
        license: "Free",
        icon: "not",
        type: "min"
    },
    {
        id: "app.license.features_metadata_free",
        license: "Premium",
        icon: "done",
        type: "min"
    },
    {
        id: "app.license.features_marketplace",
        license: "Free",
        icon: "not",
        type: "min"
    },
    {
        id: "app.license.features_marketplace",
        license: "Premium",
        icon: "done",
        type: "min"
    },
    {
        id: "app.license.features_ecommerce",
        license: "Free",
        icon: "not",
        type: "min"
    },
    {
        id: "app.license.features_ecommerce",
        license: "Premium",
        icon: "done",
        type: "min"
    },
]

const FeaturesFull = [

    {
        id: "app.license.features_full_collections_number",
        iconFree: "done",
        valuePremium: "app.license.features_unlimited",
        valueFree: "3",
        type: "full"
    },
    {
        id: "app.license.features_full_items_number",
        iconFree: "done",
        valuePremium: "app.license.features_unlimited",
        valueFree: "300",
        type: "full"
    },
    {
        id: "app.license.features_full_feeds_number",
        iconFree: "done",
        valuePremium: "app.license.features_unlimited",
        valueFree: "5",
        type: "full"
    },
    {
        id: "app.license.features_wishlist",
        iconFree: "done",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_image_gallery",
        iconFree: "done",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_users_collections",
        iconFree: "not",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_export_import_collection",
        iconFree: "not",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_metadata_free",
        iconFree: "not",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_marketplace",
        iconFree: "not",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_ecommerce",
        iconFree: "not",
        iconPremium: "done",
        type: "full"
    },
    {
        id: "app.license.features_theme",
        iconFree: "not",
        iconPremium: "done",
        type: "full"
    },
]

const FeaturesService = {
    Features, FeaturesFull
};

export default FeaturesService;