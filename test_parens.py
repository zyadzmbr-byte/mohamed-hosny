s="await Promise.race([window.fsData.deleteContent(id.toString(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]));"
print('len:', len(s))
print('parens:', s.count('('), s.count(')'))
print('brackets:', s.count('['), s.count(']'))
