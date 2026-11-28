plugins {
    id("com.android.application")
}

dependencies {
    implementation("androidx.browser:browser:1.8.0")
}

android {
    namespace = "co.sakaker.official"
    compileSdk = 35

    defaultConfig {
        applicationId = "co.sakaker.official"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
}
