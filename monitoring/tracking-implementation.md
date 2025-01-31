# Digital Aksumite Tracking Implementation Guide

## Event Tracking Setup

### Contact Form Submissions
```javascript
// Track form submissions
document.getElementById('contactForm').addEventListener('submit', function(e) {
  gtag('event', 'form_submission', {
    'event_category': 'Contact',
    'event_label': 'Contact Form'
  });
});
```

### Service Section Interactions
```javascript
// Track service clicks
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', function(e) {
    gtag('event', 'service_click', {
      'event_category': 'Services',
      'event_label': this.querySelector('.service-title').textContent
    });
  });
});
```

### Career Applications
```javascript
// Track career applications
function trackCareerApplication(position) {
  gtag('event', 'career_application', {
    'event_category': 'Careers',
    'event_label': position
  });
}
```

## Goals Setup in Google Analytics

1. Contact Form Submissions
   - Goal Type: Event
   - Category: Contact
   - Action: form_submission

2. Service Inquiries
   - Goal Type: Event
   - Category: Services
   - Action: service_click

3. Career Applications
   - Goal Type: Event
   - Category: Careers
   - Action: career_application

## Custom Dimensions

1. User Type
   - Scope: User
   - Values: ['Visitor', 'Prospect', 'Client']

2. Content Category
   - Scope: Hit
   - Values: ['Service', 'Blog', 'Case Study']

3. Interaction Depth
   - Scope: Session
   - Values: ['Low', 'Medium', 'High']

## Regular Monitoring Checklist

### Daily
- Check real-time analytics
- Monitor form submissions
- Track service interactions

### Weekly
- Analyze user behavior
- Review goal completions
- Check event tracking

### Monthly
- Generate comprehensive reports
- Review and adjust goals
- Update tracking parameters

## Data Collection Points
1. Page Views
2. User Interactions
3. Form Submissions
4. Service Interest
5. Career Applications
6. Document Downloads
7. Social Media Clicks
8. Video Interactions 