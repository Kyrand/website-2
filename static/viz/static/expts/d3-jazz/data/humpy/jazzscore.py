"""
Parse Humdrum **jazz files - storing in a 'song' dict
"""
import re

recip_re = re.compile('[0-9.]+')


class JazzScore(object):
    """Python class representing a .krn score.
    Only verified for Bach Chorales right now.
    Instantiate using JazzScore(path_to_jazzfile).
    """
    def __init__(self, file_path=None):
        self.file_path = file_path
        
        self.song = {'section_order': None, 'sections':[], 'metadata':{}, 'comments':[], 'bars':[]}
        if self.file_path:
            self.import_jazzfile(self.file_path)

    def import_jazzfile(self, file_path):
        """Import a jazzfile and overwrite the internal
           state of the JazzScore.
        """
        if self.file_path:
            self.__init__()

        self.file_path = file_path
        bars = self.song['bars']
        bars.append([])

        # Partwise markers.
        jazzfile = open(file_path)
        for line in jazzfile:
            line = line.strip()

            # Parse comments.
            if line.startswith('!!!'):
                refkey = line[3:6]
                self.song['metadata'][refkey] = line[8:]

            elif line.startswith('!!'):
                self.song['comments'].append(line[4:])

            elif line.startswith('!'):
                # Discard inline comments.
                pass

            # Parse scorewide interpretations.
            elif '*>[' in line:
                self.song['section_order'] = line[3:-1].split(',')

            elif '*>' in line:
                # self.sections.append(new_section(line, min(next_beats)))
                self.song['sections'].append({'section': line[2:], 'bars':[]})
                bars = self.song['sections'][-1]['bars']
                bars.append([])
                
            elif '*-' in line:
                # That's all, folks.
                pass

            # Parse spinewise interpretations.
            elif line.startswith('*'):

                for i, token in enumerate(line.split('\t')):
                    if token == '**jazz':
                        pass

                    elif token.startswith('*M'):
                        self.song['time_sig'] = token.lstrip('*M')

                    elif '*' in line:
                        self.song['key'] = line.strip('*').strip(':')

            # Parse data tokens.
            elif '=' in line:
                bars.append([])

            else:
                bars[-1].append(line)

        jazzfile.close()


if __name__ == '__main__':
    k = JazzScore('autumnleaves.jazz')
    print k.song

