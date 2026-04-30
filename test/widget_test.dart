import 'package:flutter_test/flutter_test.dart';

import 'package:foem/main.dart';

void main() {
  testWidgets('포엠 홈 표시', (WidgetTester tester) async {
    await tester.pumpWidget(const FoemApp());
    expect(find.text('포엠'), findsWidgets);
    expect(find.textContaining('시집 앱'), findsOneWidget);
  });
}
