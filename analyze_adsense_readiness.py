"""
Comprehensive AdSense Content Quality Analyzer
Analyzes all HTML pages for AdSense readiness and content quality issues
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup
import json

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"

class AdSenseAnalyzer:
    def __init__(self):
        self.pages = []
        self.high_risk = []
        self.medium_risk = []
        self.low_risk = []
        
    def count_words(self, html_content):
        """Count meaningful words in main content"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove script, style, nav, footer
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        
        text = soup.get_text()
        words = re.findall(r'\b\w+\b', text)
        return len(words)
    
    def analyze_content_structure(self, filepath):
        """Analyze page content structure and educational value"""
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        filename = os.path.basename(filepath)
        
        # Basic metrics
        word_count = self.count_words(content)
        h1_count = len(soup.find_all('h1'))
        h2_count = len(soup.find_all('h2'))
        h3_count = len(soup.find_all('h3'))
        
        # Check for educational indicators
        has_how_to = 'how to' in content.lower()
        has_faq = 'faq' in content.lower() or '?' in content
        has_methodology = 'methodology' in content.lower() or 'research' in content.lower()
        has_disclaimer = 'disclaimer' in content.lower() or 'educational' in content.lower()
        
        # Count prompt boxes (library-style indicator)
        prompt_boxes = len(soup.find_all(class_=re.compile(r'prompt')))
        
        # Check for educational content structure
        article_tag = soup.find('article') or soup.find('main')
        if article_tag:
            article_text = article_tag.get_text()
            article_words = len(re.findall(r'\b\w+\b', article_text))
        else:
            article_words = word_count
        
        # Calculate educational vs prompt ratio
        if prompt_boxes >0:
            educational_ratio = (article_words - (prompt_boxes * 50)) / article_words
        else:
            educational_ratio = 1.0
        
        # Risk assessment
        risk_factors = []
        risk_score = 0
        
        if word_count < 800:
            risk_factors.append("THIN_CONTENT")
            risk_score += 3
        elif word_count < 1200:
            risk_factors.append("MODERATE_LENGTH")
            risk_score += 1
        
        if prompt_boxes > 10:
            risk_factors.append("LIBRARY_STYLE")
            risk_score += 3
        elif prompt_boxes > 5:
            risk_factors.append("PROMPT_HEAVY")
            risk_score += 2
        
        if not has_how_to and not has_faq:
            risk_factors.append("LACKS_EDUCATION")
            risk_score += 2
        
        if not has_methodology:
            risk_factors.append("NO_METHODOLOGY")
            risk_score += 2
        
        if not has_disclaimer:
            risk_factors.append("NO_DISCLAIMER")
            risk_score += 1
        
        if educational_ratio < 0.5:
            risk_factors.append("PROMPTS_DOMINATE")
            risk_score += 3
        
        if h1_count == 0:
            risk_factors.append("MISSING_H1")
            risk_score += 1
        
        # Classify risk
        if risk_score >= 6:
            risk_level = "HIGH"
        elif risk_score >= 3:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return {
            'filename': filename,
            'word_count': word_count,
            'h1_count': h1_count,
            'h2_count': h2_count,
            'h3_count': h3_count,
            'prompt_boxes': prompt_boxes,
            'has_how_to': has_how_to,
            'has_faq': has_faq,
            'has_methodology': has_methodology,
            'has_disclaimer': has_disclaimer,
            'educational_ratio': round(educational_ratio, 2),
            'risk_factors': risk_factors,
            'risk_score': risk_score,
            'risk_level': risk_level
        }
    
    def analyze_all_pages(self):
        """Analyze all HTML pages in website"""
        html_files = Path(WEBSITE_ROOT).glob('*.html')
        
        for filepath in html_files:
            filename = filepath.name
            
            # Skip backup/original files
            if 'original' in filename.lower() or filename.startswith('.'):
                continue
            
            try:
                analysis = self.analyze_content_structure(str(filepath))
                self.pages.append(analysis)
                
                # Classify by risk level
                if analysis['risk_level'] == 'HIGH':
                    self.high_risk.append(analysis)
                elif analysis['risk_level'] == 'MEDIUM':
                    self.medium_risk.append(analysis)
                else:
                    self.low_risk.append(analysis)
                    
            except Exception as e:
                print(f"Error analyzing {filename}: {e}")
        
        # Sort by risk score (highest first)
        self.pages.sort(key=lambda x: x['risk_score'], reverse=True)
        self.high_risk.sort(key=lambda x: x['risk_score'], reverse=True)
        self.medium_risk.sort(key=lambda x: x['risk_score'], reverse=True)
    
    def generate_report(self):
        """Generate comprehensive analysis report"""
        print("=" * 80)
        print("ADSENSE CONTENT QUALITY ANALYSIS REPORT")
        print("=" * 80)
        print(f"\nTotal Pages Analyzed: {len(self.pages)}\n")
        
        print("RISK CLASSIFICATION:")
        print(f"  HIGH RISK:   {len(self.high_risk)} pages (Need urgent transformation)")
        print(f"  MEDIUM RISK: {len(self.medium_risk)} pages (Need enhancement)")
        print(f"  LOW RISK:    {len(self.low_risk)} pages (Minor improvements)")
        print()
        
        print("=" * 80)
        print("HIGH-RISK PAGES (CRITICAL)")
        print("=" * 80)
        for page in self.high_risk:
            print(f"\n📄 {page['filename']}")
            print(f"   Word Count: {page['word_count']} words")
            print(f"   Risk Score: {page['risk_score']}/10")
            print(f"   Risk Factors: {', '.join(page['risk_factors'])}")
            print(f"   Prompt Boxes: {page['prompt_boxes']}")
            print(f"   Educational Ratio: {page['educational_ratio']}")
            print(f"   Has How-to: {page['has_how_to']}")
            print(f"   Has FAQ: {page['has_faq']}")
            print(f"   Has Methodology: {page['has_methodology']}")
        
        print("\n" + "=" * 80)
        print("MEDIUM-RISK PAGES")
        print("=" * 80)
        for page in self.medium_risk:
            print(f"\n📄 {page['filename']}")
            print(f"   Word Count: {page['word_count']} words")
            print(f"   Risk Score: {page['risk_score']}/10")
            print(f"   Risk Factors: {', '.join(page['risk_factors'])}")
        
        print("\n" + "=" * 80)
        print("SITE-LEVEL ADSENSE DIAGNOSIS")
        print("=" * 80)
        
        total_high_medium = len(self.high_risk) + len(self.medium_risk)
        approval_risk = "VERY HIGH" if len(self.high_risk) >= 10 else "HIGH" if len(self.high_risk) >= 5 else "MEDIUM"
        
        print(f"\n🚨 APPROVAL RISK LEVEL: {approval_risk}")
        print(f"\n📊 Pages needing transformation: {total_high_medium}/{len(self.pages)}")
        
        print("\n⚠️  PRIMARY ISSUES:")
        issue_counts = {}
        for page in self.pages:
            for factor in page['risk_factors']:
                issue_counts[factor] = issue_counts.get(factor, 0) + 1
        
        for issue, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"   - {issue}: {count} pages")
        
        print("\n💡 RECOMMENDED ACTIONS:")
        print(f"   1. Transform {len(self.high_risk)} HIGH-RISK pages to 1,500-2,000 words")
        print(f"   2. Enhance {len(self.medium_risk)} MEDIUM-RISK pages to 1,200+ words")
        print(f"   3. Add Methodology sections to all content pages")
        print(f"   4. Add comprehensive FAQ sections to all content pages")
        print(f"   5. Add Disclaimer sections to all content pages")
        print(f"   6. Reframe prompts as SUPPORTING EXAMPLES")
        
        # Save JSON report
        report_data = {
            'summary': {
                'total_pages': len(self.pages),
                'high_risk': len(self.high_risk),
                'medium_risk': len(self.medium_risk),
                'low_risk': len(self.low_risk),
                'approval_risk': approval_risk
            },
            'pages': self.pages,
            'issue_distribution': issue_counts
        }
        
        with open(os.path.join(WEBSITE_ROOT, 'adsense_analysis.json'), 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print("\n✅ Detailed JSON report saved to: adsense_analysis.json")
        print("=" * 80)

def main():
    analyzer = AdSenseAnalyzer()
    analyzer.analyze_all_pages()
    analyzer.generate_report()
    
    print("\n🎯 FINAL VERDICT:")
    if len(analyzer.high_risk) >= 10:
        print("   ❌ NOT READY FOR ADSENSE REVIEW")
        print("   → Critical content quality issues on majority of pages")
    elif len(analyzer.high_risk) >= 5:
        print("   ⚠️  HIGH RISK OF REJECTION")
        print("   → Significant transformation needed before submission")
    else:
        print("   ⚠️  IMPROVEMENTS NEEDED")
        print("   → Address high-risk pages before AdSense application")

if __name__ == "__main__":
    main()
