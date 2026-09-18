# مواقيت الصلاة والآذان (Prayer Times App)

تطبيق ويب حديث لمواقيت الصلاة، التقويم الهجري، أوقات الأذان والإقامة لجميع المدن والدول بدقة فلكية عالية.

## التشغيل والتطوير (Local Development)

```bash
# تثبيت الاعتماديات
npm install

# تشغيل بيئة التطوير
npm run dev
```

## بناء المشروع للنشر (Build for Production / GitHub Pages)

```bash
# بناء النسخة المجهزة للإنتاج
npm run build
```

مجلد المخرجات هو `dist/`، وهو مهيأ بمسار نسبي (`base: './'`) ليعمل مباشرة على:
- **GitHub Pages** (سواء كان مستودع مستخدم أو مستودع مشروع فرعي `username.github.io/repo-name`)
- **Vercel / Netlify / Cloudflare Pages**
- **استضافة ثابتة أو خادم محلي**
