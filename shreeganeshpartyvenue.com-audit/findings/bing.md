# Bing SEO & IndexNow Specialist Analysis (`/seo-bing`)

## 1. Executive Summary for Bing & Copilot
Bing indexation directly impacts:
1. Microsoft Copilot AI citations.
2. DuckDuckGo, Ecosia, and Yahoo search results (all powered by Bing index).
3. Bing Search SERP rankings in Nepal & international queries.

## 2. IndexNow Protocol Implementation Status
- **Status:** **Missing**
- **Impact:** When new package offerings, catering menus, or blog posts are published, Bing is not automatically notified.
- **Implementation Guide:**
  1. Generate a 32-character hexadecimal key (e.g. `e3b0c44298fc1c149afbf4c8996fb924`).
  2. Create a file `client/public/e3b0c44298fc1c149afbf4c8996fb924.txt` containing only the key string `e3b0c44298fc1c149afbf4c8996fb924`.
  3. Submit URLs via POST request to `https://api.indexnow.org/indexnow`:
     ```json
     {
       "host": "shreeganeshpartyvenue.com",
       "key": "e3b0c44298fc1c149afbf4c8996fb924",
       "keyLocation": "https://shreeganeshpartyvenue.com/e3b0c44298fc1c149afbf4c8996fb924.txt",
       "urlList": [
         "https://shreeganeshpartyvenue.com/",
         "https://shreeganeshpartyvenue.com/wedding-venue-bhaktapur",
         "https://shreeganeshpartyvenue.com/catering-service-bhaktapur"
       ]
     }
     ```

## 3. Bing Webmaster Tools & Verification
- Ensure property is registered in Bing Webmaster Tools (`https://www.bing.com/webmasters`).
- Submit `sitemap.xml` directly to Bing Webmaster Tools dashboard.
