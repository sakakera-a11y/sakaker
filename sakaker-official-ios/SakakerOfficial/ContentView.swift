import SwiftUI
import WebKit

struct ContentView: View {
    @State private var webView: WKWebView?
    private let site = URL(string: "https://www.sakaker.co/")!
    private let channel = URL(string: "https://www.youtube.com/@sakakera")!

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("✦ سكاكر | SAKAKER")
                    .font(.headline.bold())
                    .foregroundStyle(Color(red: 0.61, green: 1, blue: 0.91))
                Spacer()
                Button("القناة") { UIApplication.shared.open(channel) }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(red: 0.02, green: 0.35, blue: 0.34))
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(Color(red: 0.02, green: 0.16, blue: 0.17))

            SakakerWebView(initialURL: site, webView: $webView)
                .background(Color.black)

            HStack(spacing: 0) {
                Button("رجوع") { webView?.goBack() }
                Spacer()
                Button("الرئيسية") { webView?.load(URLRequest(url: site)) }
                Spacer()
                Button("تحديث") { webView?.reload() }
            }
            .font(.subheadline.weight(.semibold))
            .padding(.horizontal, 24)
            .padding(.vertical, 13)
            .background(Color(red: 0.02, green: 0.16, blue: 0.17))
        }
        .background(Color.black)
    }
}

struct SakakerWebView: UIViewRepresentable {
    let initialURL: URL
    @Binding var webView: WKWebView?

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        let view = WKWebView(frame: .zero, configuration: configuration)
        view.isOpaque = false
        view.backgroundColor = .black
        view.scrollView.contentInsetAdjustmentBehavior = .never
        view.load(URLRequest(url: initialURL))
        DispatchQueue.main.async { webView = view }
        return view
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
