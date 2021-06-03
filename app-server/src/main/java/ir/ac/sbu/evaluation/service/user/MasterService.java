package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MasterService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final MasterRepository masterRepository;
    private final FacultyRepository facultyRepository;

    public MasterService(PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            PersonalInfoRepository personalInfoRepository,
            MasterRepository masterRepository,
            FacultyRepository facultyRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.masterRepository = masterRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<UserDto> listAsUser() {
        return masterRepository.findAll().stream()
                .map(master -> UserDto.from(master))
                .collect(Collectors.toList());
    }

    public Page<MasterDto> retrieveMasters(String nameQuery, Pageable pageable) {
        return masterRepository.findByFirstNameContainsOrLastNameContains(nameQuery, nameQuery, pageable)
                .map(MasterDto::from);
    }

    @Transactional
    public MasterDto save(MasterDto masterDto, long facultyId) {
        if (userRepository.findByUsername(masterDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username exists: ID = " + masterDto.getUsername());
        }
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: ID = " + facultyId));

        Master master = masterDto.toMaster();
        master.setPassword(passwordEncoder.encode(master.getPassword()));
        master.setFaculty(faculty);

        if (master.getPersonalInfo() != null) {
            PersonalInfo savedInfo = personalInfoRepository.save(master.getPersonalInfo());
            master.setPersonalInfo(savedInfo);
        }
        return MasterDto.from(masterRepository.save(master));
    }

    public MasterDto retrieve(long userId) {
        return MasterDto.from(masterRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Master not found: ID = " + userId)));
    }
}
